import { serviceSummaryMap } from "@/services/topic/mod.ts";

export const ServiceTopicDesc = ({ topic, lang, ...props } = {}) => {
  return serviceSummaryMap.get(topic)?.get(lang) ?? (() => null);
};
