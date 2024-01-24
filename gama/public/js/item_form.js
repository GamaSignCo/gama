frappe.ui.form.on('UOM Conversion Detail', {
	factor(frm, cdt, cdn) {
			cur_frm.cscript.calculate(frm, cdt, cdn);
	},
	uom(frm, cdt, cdn) {
	    cur_frm.cscript.calculate(frm, cdt, cdn);
	},
});
cur_frm.cscript.calculate = function(frm, cdt, cdn){
    var row = locals[cdt][cdn];
    frappe.model.set_value(row.doctype, row.name, 'conversion_factor', (1 / row.factor));
	cur_frm.refresh_field(row.conversion_factor);
};

frappe.ui.form.on('Item', {
    refresh(frm) {
   if (frm.doc.custom_drive_entity){
      frm.add_custom_button(__("Drive"), function() {
      window.open(origin+'/drive/folder/'+frm.doc.custom_drive_entity);
    });
    }
     },
after_save(frm){
if(frm.doc.custom_master === 0)
{
frm.set_value('custom_drive_entity', '');
refresh_field(frm.doc.drive_entity);
}
else if(frm.doc.custom_master == 1 && frm.doc.custom_customer_group)
{
    frappe.call({
        method: "gama.api.drive.utils.create",
        args: {
            doc_type: frm.doctype,
            name: frm.doc.name
        },
        callback: function (data){
            frm.set_value('custom_drive_entity', data.message);
            refresh_field(frm.doc.drive_entity);
        },
        
    });
    
}
frm.save();
},

});