import { serviceSummaryMap } from "akvaplan_fresh/services/topic/mod.ts";

export const ServiceTopicDesc = ({ topic, lang, ...props } = {}) => {
  console.warn({ topic });
  return serviceSummaryMap.get(topic)?.get(lang) ?? (() => null);
};
