export interface Query {
  id: string;
  type?: string;
  name: string;
  children: Query[];
  metadata?: any;
  isExpanded: boolean;
}
