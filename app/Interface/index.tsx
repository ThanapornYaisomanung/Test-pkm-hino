interface Progress {
  progress: number;
}

interface AuthInteface {
  clientId: string;
  clientSecret: string;
}

interface ArrayType {
  [x: string]: any;
  filter: any;
  map: Function;
  length: number;
}

interface FolderStructure {
  parentId: string;
  ownerEmail: string;
}

interface ITask {
  eType: string;
}
interface CheckData {
  id: number;
}