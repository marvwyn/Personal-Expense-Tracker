export class Expense {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly categoryId: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly date: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    categoryId: string;
    amount: number;
    description: string;
    date: string;
    createdAt: Date;
  }): Expense {
    if (!(props.amount > 0)) {
      throw new Error('Expense amount must be positive');
    }
    if (!props.description.trim()) {
      throw new Error('Expense description must not be empty');
    }
    return new Expense(
      props.id,
      props.userId,
      props.categoryId,
      props.amount,
      props.description.trim(),
      props.date,
      props.createdAt,
    );
  }
}
