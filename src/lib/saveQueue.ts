// Coalesce pending edits and serialize writes, including manual and automatic saves.
export class SaveQueue<T, R> {
  private pending?: { value: T; resolve: ((value: R) => void)[]; reject: ((error: unknown) => void)[] };
  private running = false;
  private idleResolvers: (() => void)[] = [];
  constructor(private save: (value: T) => Promise<R>) {}
  enqueue(value: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (this.pending) {
        this.pending.value = value;
        this.pending.resolve.push(resolve);
        this.pending.reject.push(reject);
      } else this.pending = { value, resolve: [resolve], reject: [reject] };
      void this.drain();
    });
  }
  idle(): Promise<void> {
    if (!this.running && !this.pending) return Promise.resolve();
    return new Promise(resolve => this.idleResolvers.push(resolve));
  }
  private async drain() {
    if (this.running) return;
    this.running = true;
    try {
      while (this.pending) {
        const job = this.pending;
        this.pending = undefined;
        try {
          const result = await this.save(job.value);
          job.resolve.forEach(resolve => resolve(result));
        } catch (error) { job.reject.forEach(reject => reject(error)); }
      }
    } finally {
      this.running = false;
      this.idleResolvers.splice(0).forEach(resolve => resolve());
    }
  }
}
