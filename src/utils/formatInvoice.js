function formatInvoiceRows(rows) {
  const invoiceMap = new Map();

  for (const row of rows) {
    const id = row.invoice_id;

    if (!invoiceMap.has(id)) {
      invoiceMap.set(id, {
        id,
        company_id: row.company_id,
        name: row.name,
        phone: row.phone,
        number: row.number,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        invoiceImg: row.invoice_image?.toString("base64") || null,
        productImg: row.product_image?.toString("base64") || null,
        products: [],
      });
    }

    invoiceMap
      .get(id)
      .products.push({
        name: row.product_name,
        returned_quantity: row.returned_quantity,
        resalable_quantity: row.resalable_quantity,
        note: row.note,
      });
  }

  return Array.from(invoiceMap.values());
}

module.exports = { formatInvoiceRows };
