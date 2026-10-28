export type StudioImageKind = 'hero' | 'work' | 'card' | 'episode';
export declare const IMAGE_PRESETS: Readonly<Record<StudioImageKind, Readonly<{ maxEdge: number; targetBytes: number }>>>;
export declare function optimizeStudioImage(file: File, kind?: StudioImageKind): Promise<File>;
