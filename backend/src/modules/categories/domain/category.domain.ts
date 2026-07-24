const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export class Category {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly color: string | null,
    public readonly icon: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    createdAt: Date;
  }): Category {
    const name = props.name.trim();
    if (!name) {
      throw new Error('Category name must not be empty');
    }
    if (props.color && !HEX_COLOR_PATTERN.test(props.color)) {
      throw new Error('Category color must be a hex value like #a1b2c3');
    }
    return new Category(
      props.id,
      props.userId,
      name,
      props.color ?? null,
      props.icon ?? null,
      props.createdAt,
    );
  }

  // A domain rule: true regardless of who's asking or how the count was
  // fetched -- distinct from authorization/existence checks (e.g. "does
  // this category belong to this user"), which are operation/ concerns.
  canBeDeleted(expenseCount: number): boolean {
    return expenseCount === 0;
  }
}
