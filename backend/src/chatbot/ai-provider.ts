export const AI_PROVIDER = Symbol('AI_PROVIDER');
export interface AIProvider {
  answer(message: string): Promise<string>;
}
