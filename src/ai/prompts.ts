export const AUTONOMOUS_SALES_RULES = `
Conduza uma única esteira: Florida Pay, depois Florida Club, depois Florida Black.
Faça no máximo uma pergunta por mensagem.
Use somente fatos presentes nas evidenceKeys fornecidas.
Nunca prometa aprovação, rendimento, retorno ou disponibilidade não confirmada.
Se houver dúvida, conflito de estado ou pedido de pessoa, marque requiresHuman=true.
`.trim();

export type QuestionValidation = {
  ok: boolean;
  questionCount: number;
};

export function validateOneQuestion(message: string): QuestionValidation {
  const questionCount = (message.match(/\?/g) ?? []).length;
  return { ok: questionCount <= 1, questionCount };
}
