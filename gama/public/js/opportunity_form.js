frappe.ui.form.on('Opportunity', {
    before_save(frm){
      frm.set_value('title',frm.doc.abbr+' - '+frm.doc.address_title+' - '+frm.doc.city);
      refresh_field('title');
    },
    after_save(frm){
      if (frm.doc.project && !frm.doc.price_analysis && !frm.doc.survey && !frm.doc.proposal_drawing){
        frappe.call({
          method: 'frappe.client.set_value',
          args: {
            doctype: 'Project',
            name: frm.doc.project,
            fieldname: 'percent_complete_method',
            value: 'Manual',
          },
          callback: function (data) {
            frappe.call({
              method: 'frappe.client.set_value',
              args: {
                doctype: 'Project',
                name: frm.doc.project,
                fieldname: 'status',
                value: 'Completed',
              },
            });
          }
        });
      }
    },
    refresh(frm) {
      if (!frappe.user.has_role('System Manager') && frm.doc.status=='Project'){
          cur_frm.set_df_property('description','read_only',0);
      }
      if (frappe.user.has_role('System Manager')){
        frm.add_custom_button(__('Survey Task'), function() {
          frm.set_value('survey_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Survey - '+frm.doc.title,'task_new':"True", 'project': frm.doc.project, 'customer':frm.doc.customer_name,'opportunity_owner':frm.doc.opportunity_owner,   'opportunity': frm.doc.name, 'department': 'Dış Montaj - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Survey','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create"));
        frm.add_custom_button(__('Price Analysis Task'), function() {
          frm.set_value('price_analysis_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Fiyat Analizi - '+frm.doc.title,'task_new':"True", 'project': frm.doc.project, 'opportunity': frm.doc.name, 'customer':frm.doc.customer_name,'opportunity_owner':frm.doc.opportunity_owner, 'department': 'Mühendislik - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Fiyat Analizi','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create"));
             frm.add_custom_button(__('Engineering Task'), function() {
          frm.set_value('engineering_proposal_drawing_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Mühendislik Teklif Çizimi - '+frm.doc.title,'task_new':"True", 'project': frm.doc.project, 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'opportunity': frm.doc.name, 'department': 'Mühendislik - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Mühendislik Teklif Çizimi','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create"));
        frm.add_custom_button(__('Graphics Task'), function() {
          frm.set_value('graphics_proposal_drawing_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Grafik Teklif Çizimi - '+frm.doc.title,'task_new':"True", 'project': frm.doc.project, 'opportunity': frm.doc.name,'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'department': 'Satış - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Grafik Teklif Çizimi','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create"));
      }
  
      if (frm.doc.custom_drive_entity){
        frm.add_custom_button(__("Drive"), function() {
        window.open(origin+'/drive/folder/'+frm.doc.custom_drive_entity);
      });
      }
  
      if(frappe.user.has_role('Engineering Manager')){
        frm.add_custom_button(__('Engineering Task'), function() {
          frm.set_value('engineering_proposal_drawing_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Mühendislik Teklif Çizimi - '+frm.doc.title,'task_new':"True", 'project': frm.doc.project, 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'opportunity': frm.doc.name, 'department': 'Mühendislik - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Mühendislik Teklif Çizimi','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create Task"));
      }
      
      if (frappe.user.has_role('Shipment & Installation Manager')){
        frm.add_custom_button(__('Survey Task'), function() {
          frm.set_value('survey_status', 'Open');
          frappe.db.insert({doctype: 'Task', 'subject': 'Survey - '+frm.doc.title, 'project': frm.doc.project, 'task_new':"True", 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'opportunity': frm.doc.name, 'department': 'Dış Montaj - GAMA', 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'type': 'Survey','abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
          frappe.db.set_value('Project', frm.doc.project, 'percent_complete_method', 'Task Completion');
          frm.save();
        }, __("Create Task"));
      }
      $("[data-doctype='Supplier Quotation']").hide();
      cur_frm.set_df_property('name','read_only',1);
      cur_frm.page.remove_inner_button(__('Supplier Quotation'),  __('Create'));
      cur_frm.page.remove_inner_button(__('Quotation'),  __('Create'));
      frm.remove_custom_button('Close');
      frm.remove_custom_button('Lost');
      frm.remove_custom_button('Reopen');
      if (frappe.user.has_role('Sales User') || frappe.user.has_role('Sales & Marketing Manager')){
        frm.set_query('shipping_address_name', erpnext.queries.address_query);
        erpnext.utils.get_address_display(frm, 'shipping_address_name', 'shipping_address', false);
        frm.set_query("opportunity_from", function() {
          return{
            "filters": {
              "name": ["in", ["Customer", "Lead"]],
            }
          };
        });
        if (frm.doc.opportunity_from == 'Lead'){
          cur_frm.set_query('project', function() {
            return {
              filters: {
                'lead': frm.doc.party_name,
                'status': 'Open',
              }
            };
          });
        }
        else if (frm.doc.opportunity_from == 'Customer'){
          cur_frm.set_query('project', function() {
            return {
              filters: {
                'customer': frm.doc.customer_name,
                'status': 'Open',
              }
            };
          });
        }
        if (frm.doc.status == 'Pending' && !frm.is_new()){
          $("[data-doctype='Quotation']").hide();
          frm.set_value('opportunity_owner',frappe.user.name);
          cur_frm.add_custom_button(__('Accept'), function() {
            frm.set_value('status', 'Open');
            frm.save();
          });
          cur_frm.add_custom_button(__('Reject'), function() {
            frm.trigger('set_as_lost_dialog');
          });
        }
        else if (frm.doc.status == 'Open' && !frm.doc.project){
          $("[data-doctype='Quotation']").hide();
          cur_frm.add_custom_button(__('Create Project'), function() {
            cur_frm.cscript.create_project(frm);
          });
          cur_frm.add_custom_button(__('Lost'), function() {
            frm.trigger('set_as_lost_dialog');
          });
        }
        else if (frm.doc.status == 'Open' && frm.doc.project){
          $("[data-doctype='Quotation']").hide();
          cur_frm.add_custom_button(__('Create Tasks'), function() {
            cur_frm.cscript.create_tasks(frm);
            frm.set_value('status', 'Project');
            frm.save();
          });
          cur_frm.add_custom_button(__('Lost'), function() {
            cur_frm.cscript.cancel_project(frm);
          });
        }
        else if (frm.doc.status == 'Lost'){
          $("[data-doctype='Quotation']").hide();
          frm.disable_save();
          cur_frm.cscript.read_only();
        }
        else if (frm.doc.status == 'Project'){
          cur_frm.cscript.read_only();
          cur_frm.add_custom_button(__('Quotation'), function() {
            cur_frm.cscript.create_quotation();
          });
          cur_frm.add_custom_button(__('Lost'), function() {
            cur_frm.cscript.cancel_project(frm);
          });
        }
        else if (frm.doc.status == 'Quotation'){
          cur_frm.add_custom_button(__('Quotation'), function() {
            cur_frm.cscript.create_quotation();
          });
          frm.disable_save();
          cur_frm.cscript.read_only();
        }
        else if (frm.doc.status == 'Converted'){
          $("[data-doctype='Quotation']").hide();
          frm.disable_save();
          cur_frm.cscript.read_only();
        }
      }
      else {
        cur_frm.cscript.read_only();
        frm.disable_save();
      }
    },
    shipping_address_name(frm){
      frappe.call({
        method: 'frappe.client.get_value',
        args: {
          doctype: 'Address',
          filters: {
            'name': frm.doc.shipping_address_name,
          },
          fieldname: ['address_title','city']
        },
        callback: function (data) {
          frm.set_value('address_title',data.message.address_title);
          frm.set_value('city',data.message.city);
          frappe.call({
            method: 'frappe.client.get_value',
            args: {
              doctype: 'Customer Group',
              filters: {
                'customer_group_name': frm.doc.customer_group,
              },
              fieldname: ['abbr']
            },
            callback: function (data) {
              if (frm.doc.opportunity_from == 'Customer')
              cur_frm.set_value('abbr',data.message.abbr);
              if (frm.doc.opportunity_from == 'Lead')
              cur_frm.set_value('abbr','CRM');
              refresh_field(frm.doc.abbr);
            },
          });
        },
      });
    },
     party_name(frm){
       setTimeout(() => {
       cur_frm.set_value('shipping_address_name','');
     },100);
     },
  });
  cur_frm.cscript.read_only = function(frm){
    cur_frm.set_df_property('price_analysis','read_only',1);
    cur_frm.set_df_property('project','read_only',1);
    cur_frm.set_df_property('survey','read_only',1);
    cur_frm.set_df_property('proposal_drawing','read_only',1);
      cur_frm.set_df_property('graphics_proposal_drawing','read_only',1);
      cur_frm.set_df_property('engineering_proposal_drawing','read_only',1);
    if (!frappe.user.has_role('System Manager')){
        cur_frm.set_df_property('description','read_only',1);
        cur_frm.set_df_property('shipping_address_name','read_only',1);
        cur_frm.set_df_property('contact_person','read_only',1);
        cur_frm.set_df_property('customer_address','read_only',1);
        cur_frm.set_df_property('title','read_only',1);
    }
    cur_frm.set_df_property('opportunity_from','read_only',1);
    cur_frm.set_df_property('party_name','read_only',1);
    cur_frm.set_df_property('customer_name','read_only',1);
    cur_frm.set_df_property('opportunity_type','read_only',1);
    cur_frm.set_df_property('sales_stage','read_only',1);
    cur_frm.set_df_property('currency','read_only',1);
    cur_frm.set_df_property('with_items','read_only',1);
    cur_frm.set_df_property('probability','read_only',1);
    cur_frm.set_df_property('items','read_only',1);
    cur_frm.set_df_property('opportunity_amount','read_only',1);
    cur_frm.set_df_property('customer_group','read_only',1);
    cur_frm.set_df_property('source','read_only',1);
    cur_frm.set_df_property('company','read_only',1);
    cur_frm.set_df_property('transaction_date','read_only',1);
    cur_frm.set_df_property('transaction_date','read_only',1);
  };
  cur_frm.cscript.create_project = function(frm){
    if (frm.doc.opportunity_from == 'Lead'){
      frappe.db.insert({
        doctype: 'Project',
        'project_name': frm.doc.title,
        'project_type': 'External',
        'lead': frm.doc.party_name,
        'opportunity': frm.doc.name,
        'percent_complete_method': 'Task Completion',
      }).then(function(doc) {
        frappe.call({
          method: 'frappe.client.get_value',
          args: {
            doctype: 'Project',
            filters: {
              'opportunity': frm.doc.name,
            },
            fieldname: ['name','status']
          },
          callback: function (data) {
            frm.set_value('project', data.message.name);
            cur_frm.refresh_field('project');
          }
        })
        frappe.run_serially([
          () => frm.set_value('status', 'Project'),
          () => frm.save(),
          () => frappe.show_alert({message:__('Proje Oluşturuldu'), indicator:'green'}, 5),
          () => cur_frm.cscript.create_tasks(frm),
          () => frappe.call({
            method: "gama.api.drive.utils.manage_project_folders",
            args: {
                project: frm.doc.project,
                },
            }),
          () => frappe.show_alert({message:__('Proje Klaösür 1-3 dakika içinde oluşacak.'), indicator:'green'}, 5),
  
        ]);
      });
    }
    else if (frm.doc.opportunity_from == 'Customer'){
      frappe.db.insert({
        doctype: 'Project',
        'project_name': frm.doc.title,
        'project_type': 'External',
        'customer': frm.doc.party_name,
        'opportunity': frm.doc.name,
        'percent_complete_method': 'Task Completion',
      }).then(function(doc) {
        frappe.call({
          method: 'frappe.client.get_value',
          args: {
            doctype: 'Project',
            filters: {
              'opportunity': frm.doc.name,
            },
            fieldname: ['name','status']
          },
          callback: function (data) {
            frm.set_value('project', data.message.name);
            cur_frm.refresh_field('project');
          }
        })
        frappe.run_serially([
          () => frm.set_value('status', 'Project'),
          () => frm.save(),
          () => frappe.show_alert({message:__('Proje Oluşturuldu'), indicator:'green'}, 5),
          () => cur_frm.cscript.create_tasks(frm),
          () => frappe.call({
            method: "gama.api.drive.utils.manage_project_folders",
            args: {
                project: frm.doc.project,
                },
            }),
          () => frappe.show_alert({message:__('Proje Klaösür 1-3 dakika içinde oluşacak.'), indicator:'green'}, 5),
  
        ]);
      });
    }
  };
  cur_frm.cscript.create_tasks = function(frm){
      if (frm.doc.survey == 1){
      frm.set_value('survey_status', 'Open');
      frappe.db.insert({doctype: 'Task', 'subject': 'Survey - '+frm.doc.title, 'project': frm.doc.project, 'task_new':"True", 'opportunity': frm.doc.name, 'department': 'Dış Montaj - GAMA', 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'description': frm.doc.description, 'type': 'Survey', 'abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
    }
    if (frm.doc.price_analysis == 1){
      frm.set_value('price_analysis_status', 'Open');
      frappe.db.insert({doctype: 'Task', 'subject': 'Fiyat Analizi - '+frm.doc.title, 'project': frm.doc.project, 'task_new':"True", 'opportunity': frm.doc.name, 'department': 'Mühendislik - GAMA', 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'description': frm.doc.description, 'type': 'Fiyat Analizi', 'abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
    }
    if (frm.doc.engineering_proposal_drawing == 1){
      frm.set_value('engineering_proposal_drawing_status', 'Open');
      frappe.db.insert({doctype:'Task','subject': 'Mühendislik Teklif Çizimi - '+frm.doc.title, 'project':frm.doc.project, 'task_new':"True", 'opportunity': frm.doc.name, 'department': 'Mühendislik - GAMA', 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'description': frm.doc.description, 'type': 'Mühendislik Teklif Çizimi', 'abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
    }
      if (frm.doc.graphics_proposal_drawing == 1){
      frm.set_value('graphics_proposal_drawing_status', 'Open');
      frappe.db.insert({doctype: 'Task', 'subject': 'Grafik Teklif Çizimi - '+frm.doc.title, 'project': frm.doc.project, 'task_new':"True", 'opportunity': frm.doc.name, 'department': 'Satış - GAMA', 'customer':frm.doc.customer_name, 'opportunity_owner':frm.doc.opportunity_owner, 'description': frm.doc.description, 'address_name':frm.doc.shipping_address_name, 'address_display': frm.doc.shipping_address, 'description': frm.doc.description, 'type': 'Grafik Teklif Çizimi', 'abbr': frm.doc.abbr, 'custom_drive_entity': frm.doc.custom_drive_entity });
    }
    frm.save();
    frappe.show_alert({message:__('Görevler Oluşturuldu.'), indicator:'green'}, 5);
  };
  cur_frm.cscript.cancel_project = function(frm){
    frappe.xcall('erpnext.projects.doctype.project.project.set_project_status',
    {project: frm.doc.project, status: 'Cancelled'});
    frm.trigger('set_as_lost_dialog');
    if (frm.doc.price_analysis == 1) frm.set_value('price_analysis_status', 'Cancelled');
    if (frm.doc.engineering_proposal_drawing == 1) frm.set_value('engineering_proposal_drawing_status', 'Cancelled');
    if (frm.doc.graphics_proposal_drawing == 1) frm.set_value('graphics_proposal_drawing_status', 'Cancelled');
    if (frm.doc.survey == 1) frm.set_value('survey_status', 'Cancelled');
    frappe.show_alert({message:__('Project Cancelled'), indicator:'red'}, 5);
    frm.save();
  };
  