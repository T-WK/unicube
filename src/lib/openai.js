const { OpenAI } = require("openai"); // v4 방식
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 2) ChatGPT 함수 호출로 송장 필드 추출
 */
async function extractInvoiceData(ocrText) {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // 필요 시 'gpt-4'로 교체
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "당신은 OCR 결과에서 운송장번호, 보내는분 이름·전화번호, 상품명을 정확히 추출하는 전문가입니다.",
        },
        {
          role: "user",
          content: `다음은 OCR로 인식된 송장 텍스트입니다:\n\n${ocrText}`,
        },
      ],
      functions: [
        {
          name: "extract_invoice_data",
          description: "송장 OCR 결과에서 주요 정보를 JSON으로 반환합니다.",
          parameters: {
            type: "object",
            properties: {
              invoice_number: {
                type: "string",
                description: "XXXX-XXXX-XXXX 형태의 운송장번호",
              },
              sender_name: {
                type: "string",
                description: "보내는분 이름",
              },
              sender_phone: {
                type: "string",
                description: "보내는분 전화번호",
              },
              item_name: {
                type: "string",
                description: "송장에 기재된 실제 상품명",
              },
            },
            required: [
              "invoice_number",
              "sender_name",
              "sender_phone",
              "item_name",
            ],
          },
        },
      ],
      function_call: { name: "extract_invoice_data" },
    });
  
    const message = response.choices[0].message;
    const args = message.function_call.arguments;
    return JSON.parse(args);
};

module.exports = { extractInvoiceData };