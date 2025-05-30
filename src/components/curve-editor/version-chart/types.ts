
export interface Version {
  id: string;
  version_number: string | number;
  name: string;
  is_current: boolean;
  created_at: string;
}

export interface CurveVersionChartProps {
  versions: Version[];
  currentVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
  onNewVersion?: () => void;
  onSetMainVersion?: (versionId: string) => void;
  onEditVersion?: (versionId: string) => void;
  onDuplicateVersion?: () => void;
  onMoveForward?: () => void;
  selectedVersionColor?: string;
}

export interface NodePosition {
  x: number;
  y: number;
}
