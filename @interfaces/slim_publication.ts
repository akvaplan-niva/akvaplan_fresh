export interface SlimPublication {
  doi: string;
  published: Date;
  printed?: string;
  type: string;
  container?: string;
  title: string;
  authors?: Author[];
  license?: string;
  cites?: number;
  pdf?: string;
}

export interface Author {
  name?: string;
  family?: string;
  given?: string;
  first?: boolean;
}
