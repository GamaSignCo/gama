frappe.listview_settings['Task'] = {
    onload: function(listview) {
          if(frappe.user.has_role('Shipment & Installation Manager')){
               if(!frappe.user.has_role('System Manager')){
            frappe.route_options = {
                "type": ["in", "Survey,Montaj / Servis" ],
            };
        }
    }
    else if(frappe.user.has_role('Engineering Manager')){
         if(!frappe.user.has_role('System Manager')){
    frappe.route_options = {
      "type": ["in", "Mühendislik Teklif Çizimi,Üretim Çizimi" ],
    };
    }
    }
    }};
    