import { signal } from "@preact/signals";
import type { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

export const userSignal = signal<MicrosoftUserinfo | null>(null);
