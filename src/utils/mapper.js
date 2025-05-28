function mapToKoreanFields(data) {
    return {
      고객이름: data.sender_name,
      전화번호: data.sender_phone,
      반송송장번호: data.invoice_number,
      제품명: data.item_name,
    };
};

function mapToEnglishFields(data) {
    return {
      sender_name: data.고객이름,
      sender_phone: data.전화번호,
      invoice_number: data.반송송장번호,
      item_name: data.제품명,
    };
}
module.exports = { mapToKoreanFields, mapToEnglishFields };
