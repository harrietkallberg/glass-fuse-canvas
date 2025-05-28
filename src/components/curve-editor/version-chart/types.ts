
export interface Version {
  id: string;
  version_number: string;
  name: string;
  is_current: boolean;
  created_at: string;
  is_template?: boolean;
}

export interface CurveVersionChartProps {
  versions: Version[];
  currentVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
  onNewVersion: () => void;
  onSetMainVersion?: (versionId: string) => void;
  selectedVersionColor?: string;
  templateData?: any;
}

export interface NodePosition {
  x: number;
  y: number;
}
