export type ShareType = "file" | "folder";
export interface FileNodeRaw {
  icon: string;
  t: number;
  id: string;
  name_all: string;
  size: string;
  time: string;
  duan: string;
  p_ico: number;
}
export type FileMoreRes =
  | {
      type: "file";
      name: string;
      downloadUrl: string;
    }
  | {
      type: "folder";
      nodes: (FileNodeRaw & {
        shareUrl: string;
      })[];
    };
