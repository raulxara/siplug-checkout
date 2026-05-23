export abstract class AbstractEntity {
  public id: number | null = null;
  public _id: string | null = null;
  public createdAt: string | null = null;
  public updatedAt: string | null = null;
  public status: string | null = null;

  hydrate(data: Record<string, unknown>): this {
    for (const [key, value] of Object.entries(data)) {
      if (key in this) {
        (this as Record<string, unknown>)[key] = value;
      }
    }

    return this;
  }
}