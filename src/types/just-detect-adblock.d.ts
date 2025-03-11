declare module "just-detect-adblock" {
  export function detectAnyAdblocker(): Promise<boolean>;
  export function detectDomAdblocker(): boolean;
  export default {
    detectAnyAdblocker,
    detectDomAdblocker,
  };
}
