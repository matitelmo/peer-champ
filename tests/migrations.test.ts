import fs from 'fs';
import path from 'path';

describe('Database Migrations', () => {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');

  it('should have migrations directory', () => {
    expect(fs.existsSync(migrationsDir)).toBe(true);
  });

  it('should have at least one migration file', () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have properly named migration files', () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'));

    files.forEach((file) => {
      // Migration files should follow the pattern: YYYYMMDDHHMMSS_description.sql
      const timestampPattern = /^\d{14}_.*\.sql$/;
      expect(file).toMatch(timestampPattern);
    });
  });

  it('should contain valid SQL in migration files', () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'));

    files.forEach((file) => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      // Basic SQL validation
      expect(content).toContain('CREATE TABLE');
      expect(content.length).toBeGreaterThan(0);

      // Should not contain common SQL injection patterns
      expect(content).not.toMatch(/;\s*DROP\s+TABLE/i);
      expect(content).not.toMatch(/;\s*DELETE\s+FROM/i);
    });
  });

  it('should have companies and users migration', () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'));
    const companiesUsersFile = files.find((f) =>
      f.includes('companies_and_users')
    );

    expect(companiesUsersFile).toBeDefined();

    if (companiesUsersFile) {
      const content = fs.readFileSync(
        path.join(migrationsDir, companiesUsersFile),
        'utf8'
      );

      // Check for required table creation
      expect(content).toMatch(/CREATE TABLE.*companies/i);
      expect(content).toMatch(/CREATE TABLE.*users/i);

      // Check for proper foreign key relationships
      expect(content).toMatch(/REFERENCES companies\(id\)/i);

      // Check for proper constraints
      expect(content).toMatch(/role.*CHECK/i);
      expect(content).toMatch(/subscription_tier.*CHECK/i);
    }
  });

  it('should have advocates migration', () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'));
    const advocatesFile = files.find((f) => f.includes('advocates'));

    expect(advocatesFile).toBeDefined();

    if (advocatesFile) {
      const content = fs.readFileSync(
        path.join(migrationsDir, advocatesFile),
        'utf8'
      );

      // Check for advocates table creation
      expect(content).toMatch(/CREATE TABLE.*advocates/i);

      // Check for proper foreign key relationships
      expect(content).toMatch(/REFERENCES companies\(id\)/i);
      expect(content).toMatch(/REFERENCES auth\.users\(id\)/i);

      // Check for proper constraints and data types
      expect(content).toMatch(/availability_score.*CHECK/i);
      expect(content).toMatch(/status.*CHECK/i);
      expect(content).toMatch(/use_cases TEXT\[\]/i);
      expect(content).toMatch(/expertise_areas TEXT\[\]/i);

      // Check for indexes on array columns
      expect(content).toMatch(/CREATE INDEX.*USING GIN/i);
    }
  });

  it('should have migration script', () => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'run-migrations.js');
    expect(fs.existsSync(scriptPath)).toBe(true);

    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('runMigrations');
    expect(content).toContain('testConnection');
  });
});
