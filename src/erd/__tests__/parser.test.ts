import { describe, it, expect } from 'vitest';
import { parseErd, mergeSchemas } from '../parser';
import { SAMPLE_ERD_CODE } from '../sampleCode';

describe('ERD Parser', () => {
  it('parses tables with attributes and fields', () => {
    const code = `
      users [icon: user, color: blue] {
        id string pk
        email string
        age number
      }
    `;
    const { schema, errors } = parseErd(code);
    expect(errors).toHaveLength(0);
    expect(schema.tables).toHaveLength(1);

    const userTable = schema.tables[0];
    expect(userTable.name).toBe('users');
    expect(userTable.icon).toBe('user');
    expect(userTable.color).toBe('blue');
    expect(userTable.fields).toHaveLength(3);
    expect(userTable.fields[0]).toMatchObject({
      name: 'id',
      type: 'string',
      isPk: true,
      isFk: false,
    });
  });

  it('parses relationships with different cardinalities', () => {
    const code = `
      users {
        id string pk
      }
      posts {
        id string pk
        userId string fk
      }
      users.id < posts.userId
      posts.userId > users.id
      users.id - posts.id
      users.id <> posts.id
    `;
    const { schema, errors } = parseErd(code);
    expect(errors).toHaveLength(0);
    expect(schema.relations).toHaveLength(4);

    expect(schema.relations[0].operator).toBe('<');
    expect(schema.relations[0].sourceCardinality).toBe('1');
    expect(schema.relations[0].targetCardinality).toBe('*');

    expect(schema.relations[1].operator).toBe('>');
    expect(schema.relations[1].sourceCardinality).toBe('*');
    expect(schema.relations[1].targetCardinality).toBe('1');

    expect(schema.relations[2].operator).toBe('-');
    expect(schema.relations[2].sourceCardinality).toBe('1');
    expect(schema.relations[2].targetCardinality).toBe('1');

    expect(schema.relations[3].operator).toBe('<>');
    expect(schema.relations[3].sourceCardinality).toBe('*');
    expect(schema.relations[3].targetCardinality).toBe('*');
  });

  it('captures syntax errors for unclosed tables and invalid relations', () => {
    const code = `
      users {
        id string pk
    `;
    const { errors } = parseErd(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('missing closing');
  });

  it('warns when relation references undefined table', () => {
    const code = `
      users {
        id string pk
      }
      users.id < missingTable.userId
    `;
    const { errors } = parseErd(code);
    expect(errors.some((e) => e.message.includes('missingTable'))).toBe(true);
  });

  it('successfully parses the complete sample ERD code', () => {
    const { schema, errors } = parseErd(SAMPLE_ERD_CODE);
    expect(errors).toHaveLength(0);
    expect(schema.tables.length).toBe(17);
    expect(schema.relations.length).toBe(29);
  });

  it('merges multiple schemas into a unified schema', () => {
    const s1 = parseErd('users {\n  id string pk\n}').schema;
    const s2 = parseErd('orders {\n  id string pk\n  userId string fk\n}\nusers.id < orders.userId').schema;
    const merged = mergeSchemas([s1, s2]);

    expect(merged.tables).toHaveLength(2);
    expect(merged.relations).toHaveLength(1);
  });
});
