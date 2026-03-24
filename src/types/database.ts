export type HumorFlavor = {
  id: number;
  created_datetime_utc: string;
  description: string | null;
  slug: string;
  created_by_user_id: string;
  modified_by_user_id: string;
  modified_datetime_utc: string;
};

export type HumorFlavorStep = {
  id: number;
  created_datetime_utc: string;
  humor_flavor_id: number;
  llm_temperature: number | null;
  order_by: number;
  llm_input_type_id: number;
  llm_output_type_id: number;
  llm_model_id: number;
  humor_flavor_step_type_id: number;
  llm_system_prompt: string | null;
  llm_user_prompt: string | null;
  description: string | null;
  
  // Joined fields
  humor_flavor_step_types?: HumorFlavorStepType;
  llm_models?: LLMModel;
};

export type HumorFlavorStepType = {
  id: number;
  slug: string;
  description: string;
};

export type LLMModel = {
  id: number;
  name: string;
  provider_model_id: string;
  is_temperature_supported: boolean;
};

export type LLMInputType = {
  id: number;
  slug: string;
  description: string;
};

export type LLMOutputType = {
  id: number;
  slug: string;
  description: string;
};
