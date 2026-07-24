// Framework-agnostic business shape -- no TypeORM/Nest imports. Kept thin
// deliberately: auth's real logic (hashing, token issuance) is an
// operation/service concern, not a domain invariant.
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
  }): User {
    const email = props.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }
    if (!props.name.trim()) {
      throw new Error('Name must not be empty');
    }
    return new User(
      props.id,
      email,
      props.name.trim(),
      props.passwordHash,
      props.createdAt,
    );
  }
}
