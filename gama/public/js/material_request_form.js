

frappe.ui.form.on('Material Request', {
	refresh(frm) {
		if(!frappe.user.has_role('System Manager')){
			cur_frm.set_df_property('material_request_type','read_only',1);
			setTimeout(() => {
				cur_frm.page.remove_inner_button(__('Sales Order'),  __('Get items from'));
				cur_frm.page.remove_inner_button(__('Product Bundle'),  __('Get items from'));
			},300);
			$("[data-doctype='Purchase Order']").hide();
			cur_frm.page.remove_inner_button(__('Purchase Order'),  __('Create'));
		}
	},
	before_save(frm, cdt, cdn)
	{
			var item_count=0;
			var min_order_item_count = 0;
			var table_count;
			var row = locals[cdt][cdn];
			var tbl = frm.doc.items || [];
			var i = tbl.length;
			table_count = tbl.length;
			cur_frm.doc.items.forEach(function(row){
			if(row.qty < row.min_order_qty){
			msgprint(row.item_code + " Ürününe Ait (" +row.min_order_qty + " " + row.stock_uom + ") Minimum Sipariş Miktarından Az Talep Açmayınız");
		    frappe.validated = false;
			}
			console.log(min_order_item_count);
			});
			while (i--)
			{
			 if(frm.doc.items[i].item_group == 'Hizmet')
				{
					item_count++;
				}
				else if(frm.doc.items[i].item_group == 'Sarf')
				{
					item_count++;
				}
				else if(frm.doc.items[i].item_group == 'Bağlantı Elemanları')
				{
					item_count++;
				}
			}
			if(item_count===table_count){
			frm.set_value('workflow_check',1);
			refresh_field('workflow_check');
			}
			else if(item_count!==0){
			frm.set_value('workflow_check',0);
			refresh_field('workflow_check');
			}
	},
	after_workflow_action(frm, cdt, cdn)
	{
		if(frm.doc.approval_state == 'Planlama - Onaylandı' && frm.doc.workflow_check == 1 ){
			frappe.xcall('frappe.model.workflow.apply_workflow',{doc: frm.doc, action: 'Approve'});
			frappe.show_alert({message:__('Otomatik Onay Verildi'), indicator:'green'}, 5);
			frappe.show_alert({message:__('Sayfayı Yenileyin'), indicator:'green'}, 5);
		}
	},

	schedule_date(frm, cdt, cdn){
    var row = locals[cdt][cdn];
    cur_frm.doc.items.forEach(function(row) {
    frappe.model.set_value(row.doctype, row.name, 'schedule_date', frm.doc.schedule_date);
    });
	},
	onload (frm){
		
  	if(!frappe.user.has_role('System Manager') && !frappe.user.has_role('Planning User')){
				cur_frm.set_df_property('links','read_only',1);
			if((frappe.user.has_role('Warehouse User') || frappe.user.has_role('Shipment User')) && frm.is_new()){
				var row = frappe.model.add_child(cur_frm.doc, "Dynamic Link", "links");
				row.link_doctype = 'Company';
				row.link_name = 'Gama Reklam San. ve Tic. A.Ş.';
				refresh_field('links');
			}
		}
	},
});

frappe.ui.form.on('Material Request Item', {
	item_code(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		cur_frm.cscript.convert_to_purchase_uom(frm, cdt, cdn);
		frappe.model.set_value(cdt,cdn,'uom',row.stock_uom);
		refresh_field('uom');
},
	qty(frm, cdt, cdn){
	cur_frm.cscript.calculate_purchase_quantity(frm, cdt, cdn);
		var row = locals[cdt][cdn];
		frappe.model.set_value(cdt,cdn,'uom',row.stock_uom);
		refresh_field('uom');
		},
});

	cur_frm.cscript.convert_to_purchase_uom = function(frm, cdt, cdn){
	var row = locals[cdt][cdn];
	cur_frm.doc.items.forEach(function(row) {
	frappe.run_serially([
		() => frappe.db.get_value('Item', row.item_code, 'purchase_uom')
			.then(data => {
				frappe.model.set_value(row.doctype, row.name, 'purchase_uom', data.message.purchase_uom);
				cur_frm.refresh_field('purchase_uom');
			}),
		() => frappe.call({
				method: 'erpnext.stock.get_item_details.get_conversion_factor',
				args: {
					item_code: row.item_code,
					uom: row.purchase_uom,
					fieldname: ['conversion_factor']
				},
				callback: function (data) {
					frappe.model.set_value(row.doctype, row.name, 'purchase_conversion_factor', data.message.conversion_factor);
					frm.refresh_field('purchase_conversion_factor');
				}
			}),
			() => frappe.model.set_value(row.doctype, row.name, 'purchase_quantity',(row.qty / row.purchase_conversion_factor)),
			() => refresh_field('purchase_quantity')
			]);
		});
};

	cur_frm.cscript.calculate_purchase_quantity = function(frm, cdt, cdn){
	var row = locals[cdt][cdn];
	var calculate_quantity=0;
	calculate_quantity = ((row.qty  / row.purchase_conversion_factor ));
	frappe.model.set_value(row.doctype, row.name, 'purchase_quantity', calculate_quantity);
	cur_frm.refresh_field(row.purchase_quantity);
};
