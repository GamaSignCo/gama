frappe.ui.form.on('Stock Entry', {
    onload(frm){
          cur_frm.set_query('receiver', function() {
              return{
                  filters: {
                      'status' : ["in", "Active"],
                  }
              };
          });  
  
      if(!frappe.user.has_role('System Manager') || !frappe.user.has_role('Warehouse User')){      
     setTimeout(() => {
       cur_frm.page.remove_inner_button(__('Material Request'),  __('Create'));
        frm.remove_custom_button('Purchase Invoice','Get Items From');
        frm.remove_custom_button('Material Request','Get Items From');
        frm.remove_custom_button('Bill of Materials','Get Items From');
        frm.remove_custom_button('Transit Entry','Get Items From');
        frm.remove_custom_button('Material Request','Create');
      },100);
        frm.set_query('item_code', 'items', function() {
            console.log('query');
          return {
            query: 'erpnext.controllers.queries.item_query',
            filters: (frm.doc.stock_entry_type === 'Malzeme Tüketimi - Sarf' || frm.doc.stock_entry_type === 'Malzeme Transferi - Sarf')  ?
            {'item_group': 'Sarf'} : {'include_item_in_manufacturing': 1 }
          };
        });
      }
          if(frappe.user.has_role('Warehouse User') && frm.doc.workflow_state == 'Approved')
          {
              frm.set_df_property('receiver','reqd',1);
              frm.set_df_property('receiver_name','reqd',1);
              frm.set_df_property('receiver_signature','reqd',1);
          }
    },
    before_save(frm){
      if(!frappe.user.has_role('System Manager')){
        if(!frappe.user.has_role('Planning User') && (frm.doc.stock_entry_type == 'Malzeme Tüketimi' || frm.doc.stock_entry_type == 'Malzeme Tüketimi - Sarf') && (frm.doc.from_warehouse == 'Merkez - Hammadde - GAMA' || frm.doc.from_warehouse == 'Merkez - Mamül - GAMA')){
          msgprint("Merkez Depolar'dan Tüketim Yetkiniz Yok");
          frappe.validated = false;
        }
        if(frm.doc.stock_entry_type == 'Malzeme Transferi - Sarf' || frm.doc.stock_entry_type == 'Malzeme Tüketimi - Sarf'){
          cur_frm.cscript.filter_sarf(frm);
        }
      }
    },
    refresh(frm){
      if(frappe.user.has_role('Shipment User'))
      {
        cur_frm.set_query('to_warehouse', function() {
          console.log('onload');
          return{
            filters: {
          'name' : ["in", "Sevkiyat - Hammadde - GAMA, Merkez - Hammadde - GAMA,Hafif Metal - Hammadde - GAMA,Plastik - Hammadde - GAMA,Led - Hammadde - GAMA,Grafik - Hammadde - GAMA,Elektrik - Hammadde - GAMA,Dijital Baskı - Hammadde - GAMA,Ağır Metal - Hammade - GAMA,Boyahane - Hammadde - GAMA"],
            }
          };
        });  
      }
          if(frappe.user.has_role('Warehouse User') && frm.doc.workflow_state == 'Approved')
          {
              frm.set_df_property('receiver','reqd',1);
              frm.set_df_property('receiver_name','reqd',1);
              frm.set_df_property('receiver_signature','reqd',1);
          }
  
      if(frappe.user.has_role('Shipment User'))
          {
            cur_frm.set_query('to_warehouse', function() {
              console.log('onload');
                    return{
                        filters: {
                    'name' : ["in", "Sevkiyat - Hammadde - GAMA, Merkez - Hammadde - GAMA,Hafif Metal - Hammadde - GAMA,Plastik - Hammadde - GAMA,Led - Hammadde - GAMA,Grafik - Hammadde - GAMA,Elektrik - Hammadde - GAMA,Dijital Baskı - Hammadde - GAMA,Ağır Metal - Hammade - GAMA,Boyahane - Hammadde - GAMA"],
                        }
                    };
                });  
          }
          
      cur_frm.add_fetch('receiver','employee_name','receiver_name');
      if(!frappe.user.has_role('System Manager')){
        frm.set_query('stock_entry_type', function() {
          return {
            'filters': {
              'name': ['in', ['Malzeme Transferi', 'Malzeme Tüketimi', 'Malzeme Transferi - Sarf', 'Malzeme Tüketimi - Sarf']],
            }
          };
        });
        setTimeout(() => {
        
          frm.remove_custom_button('Purchase Invoice','Get Items From');
          frm.remove_custom_button('Expired Batches','Get Items From');
          frm.remove_custom_button('Material Request','Get Items From');
          frm.remove_custom_button('Bill of Materials','Get Items From');
          frm.remove_custom_button('Transit Entry','Get Items From');
          frm.remove_custom_button('Material Request','Create');
        },50);
        if(!frm.doc.stock_entry_type){
          frm.set_df_property('receiver','hidden',1);
          frm.set_df_property('receiver','reqd',0);
          frm.set_df_property('receiver_name','hidden',1);
          frm.set_df_property('receiver_name','reqd',0);
          frm.set_df_property('receiver_signature','hidden',1);
          frm.set_df_property('receiver_signature','reqd',0);
          frm.set_df_property('project_table','hidden',1);
          frm.set_df_property('project', 'hidden', 1);
          frm.set_df_property('project_table', 'reqd', 0);
          frm.set_df_property('project', 'reqd', 0);
          refresh_field('project_table');
          refresh_field('project');
        }
      }
    },
    stock_entry_type(frm){
      if(frappe.user.has_role('Shipment User'))
          {
            cur_frm.set_query('to_warehouse', function() {
              console.log('onload');
                    return{
                        filters: {
                    'name' : ["in", "Sevkiyat - Hammadde - GAMA, Merkez - Hammadde - GAMA,Hafif Metal - Hammadde - GAMA,Plastik - Hammadde - GAMA,Led - Hammadde - GAMA,Grafik - Hammadde - GAMA,Elektrik - Hammadde - GAMA,Dijital Baskı - Hammadde - GAMA,Ağır Metal - Hammade - GAMA,Boyahane - Hammadde - GAMA"],
                        }
                    };
                });  
          }
      
      if(!frappe.user.has_role('System Manager')){
        if(frm.doc.workflow_state == 'Approved'){
          if(frm.doc.stock_entry_type == 'Malzeme Transferi'){
            frm.set_value('project', '');
            frm.set_value('project_table', '');
            refresh_field('project_table');
            refresh_field('project');
            frm.set_df_property('receiver','hidden',0);
            frm.set_df_property('receiver','reqd',1);
            frm.set_df_property('receiver_name','hidden',0);
            frm.set_df_property('receiver_name','reqd',1);
            frm.set_df_property('receiver_signature','hidden',0);
            frm.set_df_property('receiver_signature','reqd',1);
          }
          if(frm.doc.stock_entry_type == 'Malzeme Tüketimi'){
            frm.set_value('project', '');
            frm.set_value('project_table', '');
            refresh_field('project_table');
            refresh_field('project');
            frm.set_df_property('receiver','hidden',1);
            frm.set_df_property('receiver','reqd',0);
            frm.set_df_property('receiver_name','hidden',1);
            frm.set_df_property('receiver_name','reqd',0);
            frm.set_df_property('receiver_signature','hidden',1);
            frm.set_df_property('receiver_signature','reqd',0);
          }
          if(frm.doc.stock_entry_type == 'Malzeme Tüketimi - Sarf'){
            frm.set_value('project', '');
            frm.set_value('project_table', '');
            refresh_field('project_table');
            refresh_field('project');
            frm.set_df_property('receiver','hidden',1);
            frm.set_df_property('receiver','reqd',0);
            frm.set_df_property('receiver_name','hidden',1);
            frm.set_df_property('receiver_name','reqd',0);
            frm.set_df_property('receiver_signature','hidden',1);
            frm.set_df_property('receiver_signature','reqd',0);
          }
          if(frm.doc.stock_entry_type == 'Malzeme Transferi - Sarf'){
            frm.set_value('project', '');
            frm.set_value('project_table', '');
            refresh_field('project_table');
            refresh_field('project');
            frm.set_df_property('receiver','hidden',0);
            frm.set_df_property('receiver','reqd',1);
            frm.set_df_property('receiver_name','hidden',0);
            frm.set_df_property('receiver_name','reqd',1);
            frm.set_df_property('receiver_signature','hidden',0);
            frm.set_df_property('receiver_signature','reqd',1);
          }
        }
        if(frm.doc.workflow_state != 'Approved'){
            frm.set_df_property('receiver','hidden',1);
            frm.set_df_property('receiver','reqd',0);
            frm.set_df_property('receiver_name','hidden',1);
            frm.set_df_property('receiver_name','reqd',0);
            frm.set_df_property('receiver_signature','hidden',1);
            frm.set_df_property('receiver_signature','reqd',0);
        }
        if(frm.doc.stock_entry_type == 'Malzeme Transferi'){
          frm.set_value('project', '');
          frm.set_value('project_table', '');
          refresh_field('project_table');
          refresh_field('project');
          frm.set_df_property('to_warehouse','hidden',0);
          frm.set_df_property('project','hidden',1);
          frm.set_df_property('project', 'reqd', 0);
          frm.set_df_property('project_table', 'hidden', 0);
          frm.set_df_property('project_table', 'reqd', 1);
          refresh_field('project_table');
          refresh_field('project');
          refresh_field('to_warehouse');
        }
        if(frm.doc.stock_entry_type == 'Malzeme Tüketimi'){
          frm.set_value('project', '');
          frm.set_value('project_table', '');
          refresh_field('project_table');
          refresh_field('project');
          frm.set_df_property('to_warehouse','hidden',1);
          frm.set_df_property('project_table','hidden',1);
          frm.set_df_property('project_table', 'reqd', 0);
          frm.set_df_property('project', 'hidden', 0);
          frm.set_df_property('project', 'reqd', 1);
          refresh_field('project_table');
          refresh_field('project');
          refresh_field('to_warehouse');
        }
        if(frm.doc.stock_entry_type == 'Malzeme Tüketimi - Sarf'){
          frm.set_value('project', '');
          frm.set_value('project_table', '');
          refresh_field('project_table');
          refresh_field('project');
          frm.set_df_property('to_warehouse','hidden',1);
          frm.set_df_property('project_table','hidden',1);
          frm.set_df_property('project', 'hidden', 0);
          frm.set_df_property('project', 'reqd', 0);
          refresh_field('project_table');
          refresh_field('project');
          refresh_field('to_warehouse');
        }
        if(frm.doc.stock_entry_type == 'Malzeme Transferi - Sarf'){
          frm.set_value('project', '');
          frm.set_value('project_table', '');
          refresh_field('project_table');
          refresh_field('project');
          frm.set_df_property('to_warehouse','hidden',0);
          frm.set_df_property('project_table','hidden',0);
          frm.set_df_property('project', 'hidden', 1);
          frm.set_df_property('project_table', 'reqd', 0);
          refresh_field('project_table');
          refresh_field('project');
        }
        if(!frm.doc.stock_entry_type){
          frm.set_df_property('receiver','hidden',1);
          frm.set_df_property('receiver','reqd',0);
          frm.set_df_property('receiver_name','hidden',1);
          frm.set_df_property('receiver_name','reqd',0);
          frm.set_df_property('receiver_signature','hidden',1);
          frm.set_df_property('receiver_signature','reqd',0);
          frm.set_df_property('project_table','hidden',1);
          frm.set_df_property('project', 'hidden', 1);
          frm.set_df_property('project_table', 'reqd', 0);
          frm.set_df_property('project', 'reqd', 0);
          refresh_field('project_table');
          refresh_field('project');
        }
      }
    }
  });
  cur_frm.cscript.filter_sarf = function(frm){
    var tbl = frm.doc.items || [];
    var i = tbl.length;
    while (i--) {
      if(frm.doc.items[i].item_group != 'Sarf') {
        frappe.msgprint("Listeniz'de Sarf Olmayan Malzemeler Bulundu ve Silindi! Sarf Transferi veya Tüketimi için Sadece Sarf Malzeme Seçiniz! Sarf Olmayan Malzeme Transferi veya Tüketiminde Proje Numarası girilmesi Zorunludur!");
        frappe.validated = false;
        cur_frm.get_field('items').grid.grid_rows[i].remove();
        cur_frm.refresh_field('items');
      }
    }
  };
  frappe.ui.form.on('Stock Entry Detail', {
      refresh(frm) {
          // your code here
      },
  })