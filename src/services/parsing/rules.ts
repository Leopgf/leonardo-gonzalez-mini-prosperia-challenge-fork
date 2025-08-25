export type ReceiptFieldRule = {
  name: string;
  labels: string[];
  validate?: (value: string) => boolean;
  maxLookahead?: number;
  postLabelJoinRestOfLine?: boolean;
  matchInLine?: (line: string) => string | undefined;
};

export const rules: Array<ReceiptFieldRule> = [
  {
    name: 'vendorName',
    labels: ['emisor', 'empresa', 'razón social'],
    postLabelJoinRestOfLine: true
  },
  {
    name: 'vendorId',
    labels: ['ruc', 'identificación'],
    validate: (v) => /^[\d-]{6,}$/.test(v)
  },
  {
    name: 'invoiceNumber',
    labels: ['número', 'num', 'factura'],
    validate: (v) => /^\d{6,}$/.test(v)
  },
  {
    name: 'date',
    labels: ['fecha', 'fecha de emisión', 'emisión'],
    matchInLine: (line: string) => {
      const match = line.match(/\b\d{2}[-\/.]\d{2}[-\/.]\d{4}\b/);
      return match ? match[0] : undefined;
    }
  },
  {
    name: 'total',
    labels: ['valor total', 'total pagado', 'total'],
    validate: (v) => /^\d+[.,]\d{2}$/.test(v)
  },
  {
    name: 'taxPercentage',
    labels: ['itbms', 'iva', 'desglose itbms', 'impuesto'],
    matchInLine: (line) => {
      const match = line.match(/\b(\d{1,2}(?:[.,]\d{1,2})?)\s*%/);
      return match ? `${match[1]}%` : undefined;
    }
  },
  {
    name: 'taxAmount',
    labels: ['itbms', 'iva', 'tax amount'],
    validate: (v) => /^\d+[.,]\d{2}$/.test(v)
  },
  {
    name: 'subtotal',
    labels: ['unitario', 'subtotal', 'subttl'],
    validate: (v) => /^\d+[.,]\d{2}$/.test(v)
  }
];
