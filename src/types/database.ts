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
};
