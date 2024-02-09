table_schema,table_name,column_name,data_type,is_nullable,column_default
public,agent,id,bigint,NO,nextval('agent_id_seq'::regclass)
public,agent,created_by,character varying,NO,NULL
public,agent,created_at,timestamp with time zone,NO,now()
public,agent,updated_by,character varying,YES,NULL
public,agent,updated_at,timestamp with time zone,YES,NULL
public,agent,firstname,character varying,NO,NULL
public,agent,lastname,character varying,YES,NULL
public,agent,phone,character varying,NO,NULL
public,agent,email,character varying,YES,NULL
public,agent,company_id,bigint,NO,NULL
public,agent,app_user_id,bigint,NO,NULL
public,agent_aggrement,id,bigint,NO,nextval('agent_aggrement_id_seq'::regclass)
public,agent_aggrement,created_by,character varying,NO,NULL
public,agent_aggrement,created_at,timestamp with time zone,NO,now()
public,agent_aggrement,updated_by,character varying,YES,NULL
public,agent_aggrement,updated_at,timestamp with time zone,YES,NULL
public,agent_aggrement,agent_id,bigint,NO,NULL
public,agent_aggrement,legal_document_id,bigint,NO,NULL
public,agent_aggrement,latitude,double precision,NO,NULL
public,agent_aggrement,longitude,double precision,NO,NULL
public,agent_aggrement,ip_address,character varying,NO,NULL
public,agent_aggrement,system_device,character varying,NO,NULL
public,agent_aggrement,system_version,character varying,NO,NULL
public,agent_metric,id,bigint,NO,nextval('agent_metric_id_seq'::regclass)
public,agent_metric,created_by,character varying,NO,NULL
public,agent_metric,created_at,timestamp with time zone,NO,now()
public,agent_metric,updated_by,character varying,YES,NULL
public,agent_metric,updated_at,timestamp with time zone,YES,NULL
public,agent_metric,agent_id,bigint,NO,NULL
public,agent_metric,metric_id,bigint,NO,NULL
public,agent_metric,value,numeric,NO,0
public,app_user,id,bigint,NO,nextval('app_user_id_seq'::regclass)
public,app_user,created_by,character varying,NO,NULL
public,app_user,created_at,timestamp with time zone,NO,now()
public,app_user,updated_by,character varying,YES,NULL
public,app_user,updated_at,timestamp with time zone,YES,NULL
public,app_user,username,character varying,NO,NULL
public,app_user,password,character varying,YES,NULL
public,app_user,email,character varying,YES,NULL
public,app_user,phone,character varying,YES,NULL
public,app_user,last_login_at,timestamp with time zone,YES,NULL
public,app_user,app_role,character varying,NO,NULL
public,card,id,bigint,NO,nextval('card_id_seq'::regclass)
public,card,created_by,character varying,NO,NULL
public,card,created_at,timestamp with time zone,NO,now()
public,card,updated_by,character varying,YES,NULL
public,card,updated_at,timestamp with time zone,YES,NULL
public,card,stripe_account_id,bigint,NO,NULL
public,card,last4,character varying,NO,NULL
public,card,name,character varying,NO,NULL
public,card,is_instant,boolean,NO,false
public,card,is_on_boarding_completed,boolean,NO,false
public,card_transaction,id,bigint,NO,nextval('card_transaction_id_seq'::regclass)
public,card_transaction,created_by,character varying,NO,NULL
public,card_transaction,created_at,timestamp with time zone,NO,now()
public,card_transaction,updated_by,character varying,YES,NULL
public,card_transaction,updated_at,timestamp with time zone,YES,NULL
public,card_transaction,card_id,bigint,NO,NULL
public,card_transaction,category,character varying,NO,NULL
public,card_transaction,amount,numeric,NO,0
public,card_transaction,status,character varying,NO,NULL
public,card_transaction,description,text,YES,NULL
public,company,id,bigint,NO,nextval('company_id_seq'::regclass)
public,company,created_by,character varying,NO,NULL
public,company,created_at,timestamp with time zone,NO,now()
public,company,updated_by,character varying,YES,NULL
public,company,updated_at,timestamp with time zone,YES,NULL
public,company,name,character varying,NO,NULL
public,company,is_rate_override,boolean,NO,false
public,company,phone,character varying,YES,NULL
public,company,email,character varying,YES,NULL
public,company,usdot,character varying,YES,NULL
public,company,type,character varying,YES,NULL
public,company_aggrement,id,bigint,NO,nextval('company_aggrement_id_seq'::regclass)
public,company_aggrement,created_by,character varying,NO,NULL
public,company_aggrement,created_at,timestamp with time zone,NO,now()
public,company_aggrement,updated_by,character varying,YES,NULL
public,company_aggrement,updated_at,timestamp with time zone,YES,NULL
public,company_aggrement,company_id,bigint,NO,NULL
public,company_aggrement,legal_document_id,bigint,NO,NULL
public,company_aggrement,latitude,double precision,NO,NULL
public,company_aggrement,longitude,double precision,NO,NULL
public,company_aggrement,ip_address,character varying,NO,NULL
public,company_aggrement,system_device,character varying,NO,NULL
public,company_aggrement,system_version,character varying,NO,NULL
public,company_labor,id,bigint,NO,nextval('company_labor_id_seq'::regclass)
public,company_labor,created_by,character varying,NO,NULL
public,company_labor,created_at,timestamp with time zone,NO,now()
public,company_labor,updated_by,character varying,YES,NULL
public,company_labor,updated_at,timestamp with time zone,YES,NULL
public,company_labor,company_id,bigint,NO,NULL
public,company_labor,company_labor_id,bigint,NO,NULL
public,company_labor,value,numeric,NO,0
public,company_rate,id,bigint,NO,nextval('company_rate_id_seq'::regclass)
public,company_rate,created_by,character varying,NO,NULL
public,company_rate,created_at,timestamp with time zone,NO,now()
public,company_rate,updated_by,character varying,YES,NULL
public,company_rate,updated_at,timestamp with time zone,YES,NULL
public,company_rate,company_id,bigint,NO,NULL
public,company_rate,company_rate_id,bigint,NO,NULL
public,company_rate,value,numeric,NO,0
public,dictionary,id,bigint,NO,nextval('dictionary_id_seq'::regclass)
public,dictionary,created_by,character varying,NO,NULL
public,dictionary,created_at,timestamp with time zone,NO,now()
public,dictionary,updated_by,character varying,YES,NULL
public,dictionary,updated_at,timestamp with time zone,YES,NULL
public,dictionary,domain,character varying,NO,NULL
public,dictionary,value,character varying,YES,NULL
public,dictionary,order_num,integer,YES,0
public,dictionary,description,text,YES,NULL
public,dictionary,parent_id,bigint,YES,NULL
public,dictionary,is_active,boolean,NO,true
public,dispatcher,id,bigint,NO,nextval('dispatcher_id_seq'::regclass)
public,dispatcher,created_by,character varying,NO,NULL
public,dispatcher,created_at,timestamp with time zone,NO,now()
public,dispatcher,updated_by,character varying,YES,NULL
public,dispatcher,updated_at,timestamp with time zone,YES,NULL
public,dispatcher,firstname,character varying,NO,NULL
public,dispatcher,lastname,character varying,YES,NULL
public,dispatcher,is_no_text_messages,boolean,NO,false
public,dispatcher,phone,character varying,NO,NULL
public,dispatcher,email,character varying,YES,NULL
public,dispatcher,company_id,bigint,YES,NULL
public,dispatcher,type_id,bigint,NO,NULL
public,dispatcher_aggrement,id,bigint,NO,nextval('dispatcher_aggrement_id_seq'::regclass)
public,dispatcher_aggrement,created_by,character varying,NO,NULL
public,dispatcher_aggrement,created_at,timestamp with time zone,NO,now()
public,dispatcher_aggrement,updated_by,character varying,YES,NULL
public,dispatcher_aggrement,updated_at,timestamp with time zone,YES,NULL
public,dispatcher_aggrement,dispatcher_id,bigint,NO,NULL
public,dispatcher_aggrement,legal_document_id,bigint,NO,NULL
public,dispatcher_aggrement,latitude,double precision,NO,NULL
public,dispatcher_aggrement,longitude,double precision,NO,NULL
public,dispatcher_aggrement,ip_address,character varying,NO,NULL
public,dispatcher_aggrement,system_device,character varying,NO,NULL
public,dispatcher_aggrement,system_version,character varying,NO,NULL
public,driver,id,bigint,NO,nextval('driver_id_seq'::regclass)
public,driver,created_by,character varying,NO,NULL
public,driver,created_at,timestamp with time zone,NO,now()
public,driver,updated_by,character varying,YES,NULL
public,driver,updated_at,timestamp with time zone,YES,NULL
public,driver,firstname,character varying,NO,NULL
public,driver,lastname,character varying,YES,NULL
public,driver,is_no_text_messages,boolean,NO,false
public,driver,phone,character varying,NO,NULL
public,driver,email,character varying,YES,NULL
public,driver,company_id,bigint,YES,NULL
public,driver,app_user_id,bigint,YES,NULL
public,driver_aggrement,id,bigint,NO,nextval('driver_aggrement_id_seq'::regclass)
public,driver_aggrement,created_by,character varying,NO,NULL
public,driver_aggrement,created_at,timestamp with time zone,NO,now()
public,driver_aggrement,updated_by,character varying,YES,NULL
public,driver_aggrement,updated_at,timestamp with time zone,YES,NULL
public,driver_aggrement,driver_id,bigint,NO,NULL
public,driver_aggrement,legal_document_id,bigint,NO,NULL
public,driver_aggrement,latitude,double precision,NO,NULL
public,driver_aggrement,longitude,double precision,NO,NULL
public,driver_aggrement,ip_address,character varying,NO,NULL
public,driver_aggrement,system_device,character varying,NO,NULL
public,driver_aggrement,system_version,character varying,NO,NULL
public,email,id,bigint,NO,nextval('email_id_seq'::regclass)
public,email,created_by,character varying,NO,NULL
public,email,created_at,timestamp with time zone,NO,now()
public,email,updated_by,character varying,YES,NULL
public,email,updated_at,timestamp with time zone,YES,NULL
public,email,job_id,bigint,YES,NULL
public,email,content_type,character varying,YES,NULL
public,email,url,character varying,YES,NULL
public,email,filename,character varying,YES,NULL
public,email,email_body,text,NO,NULL
public,email,email_subject,text,NO,NULL
public,email,email_from,character varying,NO,NULL
public,email,email_to,character varying,NO,NULL
public,email,email_type,character varying,NO,NULL
public,email,sent_at,timestamp with time zone,YES,NULL
public,email,status,character varying,NO,NULL
public,email_input_history,id,bigint,NO,nextval('email_input_history_id_seq'::regclass)
public,email_input_history,created_by,character varying,NO,NULL
public,email_input_history,created_at,timestamp with time zone,NO,now()
public,email_input_history,updated_by,character varying,YES,NULL
public,email_input_history,updated_at,timestamp with time zone,YES,NULL
public,email_input_history,email,character varying,NO,NULL
public,email_input_history,job_id,bigint,NO,NULL
public,flyway_schema_history,installed_rank,integer,NO,NULL
public,flyway_schema_history,version,character varying,YES,NULL
public,flyway_schema_history,description,character varying,NO,NULL
public,flyway_schema_history,type,character varying,NO,NULL
public,flyway_schema_history,script,character varying,NO,NULL
public,flyway_schema_history,checksum,integer,YES,NULL
public,flyway_schema_history,installed_by,character varying,NO,NULL
public,flyway_schema_history,installed_on,timestamp without time zone,NO,now()
public,flyway_schema_history,execution_time,integer,NO,NULL
public,flyway_schema_history,success,boolean,NO,NULL
public,job_comment,id,bigint,NO,nextval('job_comment_id_seq'::regclass)
public,job_comment,created_by,character varying,NO,NULL
public,job_comment,created_at,timestamp with time zone,NO,now()
public,job_comment,updated_by,character varying,YES,NULL
public,job_comment,updated_at,timestamp with time zone,YES,NULL
public,job_comment,job_id,bigint,NO,NULL
public,job_comment,comment,text,NO,NULL
public,job_comment,order_num,integer,NO,0
public,job_labor,id,bigint,NO,nextval('job_labor_id_seq'::regclass)
public,job_labor,created_by,character varying,NO,NULL
public,job_labor,created_at,timestamp with time zone,NO,now()
public,job_labor,updated_by,character varying,YES,NULL
public,job_labor,updated_at,timestamp with time zone,YES,NULL
public,job_labor,job_id,bigint,NO,NULL
public,job_labor,start_time,timestamp with time zone,NO,CURRENT_TIMESTAMP
public,job_labor,end_time,timestamp with time zone,YES,NULL
public,job_labor,provider_id,bigint,YES,NULL
public,job_pay,id,bigint,NO,nextval('job_pay_id_seq'::regclass)
public,job_pay,created_by,character varying,NO,NULL
public,job_pay,created_at,timestamp with time zone,NO,now()
public,job_pay,updated_by,character varying,YES,NULL
public,job_pay,updated_at,timestamp with time zone,YES,NULL
public,job_pay,job_id,bigint,NO,NULL
public,job_pay,name,character varying,NO,NULL
public,job_pay,amount,numeric,NO,0
public,job_pay,quantity,numeric,NO,0
public,job_pay,is_modifiable,boolean,NO,false
public,job_pay,order_num,integer,NO,0
public,job_queue,id,bigint,NO,nextval('job_queue_id_seq'::regclass)
public,job_queue,created_by,character varying,NO,NULL
public,job_queue,created_at,timestamp with time zone,NO,now()
public,job_queue,updated_by,character varying,YES,NULL
public,job_queue,updated_at,timestamp with time zone,YES,NULL
public,job_queue,job_id,bigint,NO,NULL
public,job_queue,order_num,integer,NO,0
public,job_queue,provider_id,bigint,YES,NULL
public,job_schedule,id,bigint,NO,nextval('job_schedule_id_seq'::regclass)
public,job_schedule,created_by,character varying,NO,NULL
public,job_schedule,created_at,timestamp with time zone,NO,now()
public,job_schedule,updated_by,character varying,YES,NULL
public,job_schedule,updated_at,timestamp with time zone,YES,NULL
public,job_schedule,job_queue_id,bigint,NO,NULL
public,job_table,id,bigint,NO,nextval('job_id_seq'::regclass)
public,job_table,created_by,character varying,NO,NULL
public,job_table,created_at,timestamp with time zone,NO,now()
public,job_table,updated_by,character varying,YES,NULL
public,job_table,updated_at,timestamp with time zone,YES,NULL
public,job_table,dispatcher_id,bigint,YES,NULL
public,job_table,service_area_id,bigint,NO,NULL
public,job_table,company_id,bigint,YES,NULL
public,job_table,location_address,character varying,NO,NULL
public,job_table,location_state,character varying,NO,NULL
public,job_table,location_city,character varying,NO,NULL
public,job_table,location_details,character varying,NO,NULL
public,job_table,location_notes,text,YES,NULL
public,job_table,location_latitude,double precision,NO,NULL
public,job_table,location_longitude,double precision,NO,NULL
public,job_table,is_pending_review,boolean,NO,true
public,job_table,status_id,character varying,NO,'UNASSIGNED'::character varying
public,job_table,total_cost,numeric,NO,0
public,job_table,payment_method,character varying,YES,NULL
public,job_table,payment_refnumber,character varying,YES,NULL
public,job_table,promised_time,timestamp with time zone,NO,NULL
public,job_table,provider_id,bigint,YES,NULL
public,job_table,location_type,character varying,YES,NULL
public,job_table,rating,numeric,YES,NULL
public,job_vehicle,id,bigint,NO,nextval('job_vehicle_id_seq'::regclass)
public,job_vehicle,created_by,character varying,NO,NULL
public,job_vehicle,created_at,timestamp with time zone,NO,now()
public,job_vehicle,updated_by,character varying,YES,NULL
public,job_vehicle,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle,job_id,bigint,NO,NULL
public,job_vehicle,vehicle_id,bigint,NO,NULL
public,job_vehicle,vehicle_issue,text,NO,NULL
public,job_vehicle_service,id,bigint,NO,nextval('job_vehicle_service_id_seq'::regclass)
public,job_vehicle_service,created_by,character varying,NO,NULL
public,job_vehicle_service,created_at,timestamp with time zone,NO,now()
public,job_vehicle_service,updated_by,character varying,YES,NULL
public,job_vehicle_service,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle_service,job_vehicle_id,bigint,NO,NULL
public,job_vehicle_service,service_id,bigint,NO,NULL
public,job_vehicle_service,status_id,bigint,YES,NULL
public,job_vehicle_service,cost,numeric,NO,0
public,job_vehicle_service_answer,id,bigint,NO,nextval('job_service_answer_id_seq'::regclass)
public,job_vehicle_service_answer,created_by,character varying,NO,NULL
public,job_vehicle_service_answer,created_at,timestamp with time zone,NO,now()
public,job_vehicle_service_answer,updated_by,character varying,YES,NULL
public,job_vehicle_service_answer,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle_service_answer,job_vehicle_service_id,bigint,NO,NULL
public,job_vehicle_service_answer,service_question_id,bigint,NO,NULL
public,job_vehicle_service_answer,answer,text,NO,NULL
public,job_vehicle_service_comment,id,bigint,NO,nextval('job_vehicle_service_comment_id_seq'::regclass)
public,job_vehicle_service_comment,created_by,character varying,NO,NULL
public,job_vehicle_service_comment,created_at,timestamp with time zone,NO,now()
public,job_vehicle_service_comment,updated_by,character varying,YES,NULL
public,job_vehicle_service_comment,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle_service_comment,job_vehicle_service_id,bigint,NO,NULL
public,job_vehicle_service_comment,comment,text,NO,NULL
public,job_vehicle_service_comment,order_num,integer,NO,0
public,job_vehicle_service_part,id,bigint,NO,nextval('job_part_id_seq'::regclass)
public,job_vehicle_service_part,created_by,character varying,NO,NULL
public,job_vehicle_service_part,created_at,timestamp with time zone,NO,now()
public,job_vehicle_service_part,updated_by,character varying,YES,NULL
public,job_vehicle_service_part,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle_service_part,job_vehicle_service_id,bigint,NO,NULL
public,job_vehicle_service_part,service_common_part_id,bigint,NO,NULL
public,job_vehicle_service_part,description,text,YES,NULL
public,job_vehicle_service_part,quantity,integer,NO,1
public,job_vehicle_service_part,price,numeric,NO,0
public,job_vehicle_service_part,markup,numeric,NO,20
public,job_vehicle_service_part,cost,numeric,NO,0
public,job_vehicle_service_part,order_num,integer,NO,0
public,job_vehicle_service_photo,id,bigint,NO,nextval('job_photo_id_seq'::regclass)
public,job_vehicle_service_photo,created_by,character varying,NO,NULL
public,job_vehicle_service_photo,created_at,timestamp with time zone,NO,now()
public,job_vehicle_service_photo,updated_by,character varying,YES,NULL
public,job_vehicle_service_photo,updated_at,timestamp with time zone,YES,NULL
public,job_vehicle_service_photo,job_vehicle_service_id,bigint,NO,NULL
public,job_vehicle_service_photo,content_type,character varying,NO,NULL
public,job_vehicle_service_photo,url,character varying,NO,NULL
public,job_vehicle_service_photo,filename,character varying,NO,NULL
public,job_vehicle_service_photo,order_num,integer,NO,0
public,legal_document,id,bigint,NO,nextval('legal_document_id_seq'::regclass)
public,legal_document,created_by,character varying,NO,NULL
public,legal_document,created_at,timestamp with time zone,NO,now()
public,legal_document,updated_by,character varying,YES,NULL
public,legal_document,updated_at,timestamp with time zone,YES,NULL
public,legal_document,locale,character varying,NO,'en-US'::character varying
public,legal_document,title,character varying,NO,NULL
public,legal_document,type_id,bigint,NO,NULL
public,legal_document,revison_no,integer,NO,0
public,legal_document,published_at,timestamp with time zone,NO,now()
public,legal_document,legal_text,text,NO,NULL
public,payment,id,bigint,NO,nextval('payment_id_seq'::regclass)
public,payment,created_by,character varying,NO,NULL
public,payment,created_at,timestamp with time zone,NO,now()
public,payment,updated_by,character varying,YES,NULL
public,payment,updated_at,timestamp with time zone,YES,NULL
public,payment,job_id,bigint,NO,NULL
public,payment,status,character varying,YES,NULL
public,payment,amount,numeric,NO,NULL
public,payment,provider_id,bigint,YES,NULL
public,payment,credit_card_last_digits,character,YES,NULL::bpchar
public,payment,date_time,timestamp with time zone,YES,now()
public,payment,method,character varying,NO,NULL
public,payout,id,bigint,NO,nextval('payout_id_seq'::regclass)
public,payout,created_by,character varying,NO,NULL
public,payout,created_at,timestamp with time zone,NO,now()
public,payout,updated_by,character varying,YES,NULL
public,payout,updated_at,timestamp with time zone,YES,NULL
public,payout,job_id,bigint,YES,NULL
public,payout,provider_id,bigint,NO,NULL
public,payout,status,character varying,NO,NULL
public,payout,amount,numeric,NO,NULL
public,payout,fee,numeric,NO,0
public,payout,destination,character varying,YES,NULL
public,payout,method,character varying,YES,NULL
public,provider,id,bigint,NO,nextval('provider_id_seq'::regclass)
public,provider,created_by,character varying,NO,NULL
public,provider,created_at,timestamp with time zone,NO,now()
public,provider,updated_by,character varying,YES,NULL
public,provider,updated_at,timestamp with time zone,YES,NULL
public,provider,firstname,character varying,NO,NULL
public,provider,lastname,character varying,NO,NULL
public,provider,company_id,bigint,YES,NULL
public,provider,address,character varying,YES,NULL
public,provider,city,character varying,YES,NULL
public,provider,state,character varying,YES,NULL
public,provider,zip,character varying,YES,NULL
public,provider,email,character varying,YES,NULL
public,provider,phone,character varying,NO,NULL
public,provider,is_blocked,boolean,NO,false
public,provider,balance,numeric,NO,0
public,provider,status_change_date,timestamp with time zone,YES,NULL
public,provider,is_online,boolean,NO,false
public,provider,is_onjob,boolean,NO,false
public,provider,app_user_id,bigint,YES,NULL
public,provider,provider_type,character varying,NO,NULL
public,provider,rating,numeric,NO,NULL
public,provider,firebase_uid,character varying,YES,NULL
public,provider_aggrement,id,bigint,NO,nextval('provider_aggrement_id_seq'::regclass)
public,provider_aggrement,created_by,character varying,NO,NULL
public,provider_aggrement,created_at,timestamp with time zone,NO,now()
public,provider_aggrement,updated_by,character varying,YES,NULL
public,provider_aggrement,updated_at,timestamp with time zone,YES,NULL
public,provider_aggrement,provider_id,bigint,NO,NULL
public,provider_aggrement,legal_document_id,bigint,NO,NULL
public,provider_aggrement,latitude,double precision,NO,NULL
public,provider_aggrement,longitude,double precision,NO,NULL
public,provider_aggrement,ip_address,character varying,NO,NULL
public,provider_aggrement,system_device,character varying,NO,NULL
public,provider_aggrement,system_version,character varying,NO,NULL
public,provider_location,id,bigint,NO,nextval('location_id_seq'::regclass)
public,provider_location,created_by,character varying,NO,NULL
public,provider_location,created_at,timestamp with time zone,NO,now()
public,provider_location,updated_by,character varying,YES,NULL
public,provider_location,updated_at,timestamp with time zone,YES,NULL
public,provider_location,provider_id,bigint,YES,NULL
public,provider_location,speed,double precision,YES,0
public,provider_location,speed_accuracy,double precision,YES,NULL
public,provider_location,vertical_accuracy,numeric,YES,NULL
public,provider_location,course_accuracy,double precision,YES,NULL
public,provider_location,course,double precision,YES,NULL
public,provider_location,longitude,double precision,YES,NULL
public,provider_location,latitude,double precision,YES,NULL
public,provider_location,accuracy,double precision,YES,NULL
public,provider_location,job_id,bigint,YES,NULL
public,provider_metric,id,bigint,NO,nextval('provider_metric_id_seq'::regclass)
public,provider_metric,created_by,character varying,NO,NULL
public,provider_metric,created_at,timestamp with time zone,NO,now()
public,provider_metric,updated_by,character varying,YES,NULL
public,provider_metric,updated_at,timestamp with time zone,YES,NULL
public,provider_metric,provider_id,bigint,NO,NULL
public,provider_metric,metric_id,bigint,NO,NULL
public,provider_metric,value,numeric,NO,0
public,provider_rate,id,bigint,NO,nextval('provider_rate_id_seq'::regclass)
public,provider_rate,created_by,character varying,NO,NULL
public,provider_rate,created_at,timestamp with time zone,NO,now()
public,provider_rate,updated_by,character varying,YES,NULL
public,provider_rate,updated_at,timestamp with time zone,YES,NULL
public,provider_rate,provider_id,bigint,NO,NULL
public,provider_rate,rate_id,bigint,NO,NULL
public,provider_rate,value,numeric,NO,0
public,provider_service,id,bigint,NO,nextval('provider_service_id_seq'::regclass)
public,provider_service,created_by,character varying,NO,NULL
public,provider_service,created_at,timestamp with time zone,NO,now()
public,provider_service,updated_by,character varying,YES,NULL
public,provider_service,updated_at,timestamp with time zone,YES,NULL
public,provider_service,provider_id,bigint,NO,NULL
public,provider_service,service_id,bigint,NO,NULL
public,provider_service,is_enabled,boolean,NO,true
public,provider_service_area,id,bigint,NO,nextval('provider_service_area_id_seq'::regclass)
public,provider_service_area,created_by,character varying,NO,NULL
public,provider_service_area,created_at,timestamp with time zone,NO,now()
public,provider_service_area,updated_by,character varying,YES,NULL
public,provider_service_area,updated_at,timestamp with time zone,YES,NULL
public,provider_service_area,provider_id,bigint,NO,NULL
public,provider_service_area,service_area_id,bigint,NO,NULL
public,provider_service_area,is_enabled,boolean,NO,true
public,providers_uids,accountId,text,YES,NULL
public,providers_uids,email,text,YES,NULL
public,providers_uids,firstName,text,YES,NULL
public,providers_uids,lastName,text,YES,NULL
public,providers_uids,phoneNumber,character varying,YES,NULL
public,providers_uids,uid,text,YES,NULL
public,request,id,bigint,NO,nextval('request_id_seq'::regclass)
public,request,created_by,character varying,NO,NULL
public,request,created_at,timestamp with time zone,NO,now()
public,request,updated_by,character varying,YES,NULL
public,request,updated_at,timestamp with time zone,YES,NULL
public,request,dispatcher_id,bigint,YES,NULL
public,request,provider_id,bigint,NO,NULL
public,request,service_area_id,bigint,NO,NULL
public,request,location_address,character varying,NO,NULL
public,request,location_state,character varying,NO,NULL
public,request,location_city,character varying,NO,NULL
public,request,location_details,character varying,NO,NULL
public,request,location_notes,text,YES,NULL
public,request,location_latitude,double precision,NO,NULL
public,request,location_longitude,double precision,NO,NULL
public,request,response_time,timestamp with time zone,YES,NULL
public,request,job_id,bigint,NO,NULL
public,request,status,character varying,NO,NULL
public,request,provider_online,boolean,YES,false
public,request,distance,numeric,YES,NULL
public,request,duration,numeric,YES,NULL
public,service,id,bigint,NO,nextval('service_id_seq'::regclass)
public,service,created_by,character varying,NO,NULL
public,service,created_at,timestamp with time zone,NO,now()
public,service,updated_by,character varying,YES,NULL
public,service,updated_at,timestamp with time zone,YES,NULL
public,service,name,character varying,NO,NULL
public,service,description,text,YES,NULL
public,service,icon_id,bigint,YES,NULL
public,service,is_active,boolean,NO,false
public,service,labor_type_rate_id,bigint,NO,NULL
public,service,rate_value,numeric,NO,0
public,service,disclaimer,text,YES,NULL
public,service,min_hours,bigint,YES,NULL
public,service_area,id,bigint,NO,nextval('service_area_id_seq'::regclass)
public,service_area,created_by,character varying,NO,NULL
public,service_area,created_at,timestamp with time zone,NO,now()
public,service_area,updated_by,character varying,YES,NULL
public,service_area,updated_at,timestamp with time zone,YES,NULL
public,service_area,area_name,character varying,NO,NULL
public,service_area,area_state,character varying,NO,NULL
public,service_area,url_link,character varying,NO,NULL
public,service_area,is_active,boolean,NO,false
public,service_area,latitude,double precision,NO,NULL
public,service_area,longitude,double precision,NO,NULL
public,service_area_rate,id,bigint,NO,nextval('service_area_rate_id_seq'::regclass)
public,service_area_rate,created_by,character varying,NO,NULL
public,service_area_rate,created_at,timestamp with time zone,NO,now()
public,service_area_rate,updated_by,character varying,YES,NULL
public,service_area_rate,updated_at,timestamp with time zone,YES,NULL
public,service_area_rate,area_id,bigint,NO,NULL
public,service_area_rate,area_rate_id,bigint,NO,NULL
public,service_area_rate,value,numeric,NO,0
public,service_common_part,id,bigint,NO,nextval('service_common_part_id_seq'::regclass)
public,service_common_part,created_by,character varying,NO,NULL
public,service_common_part,created_at,timestamp with time zone,NO,now()
public,service_common_part,updated_by,character varying,YES,NULL
public,service_common_part,updated_at,timestamp with time zone,YES,NULL
public,service_common_part,service_id,bigint,NO,NULL
public,service_common_part,part_id,bigint,NO,NULL
public,service_common_part,order_num,integer,NO,1
public,service_question,id,bigint,NO,nextval('service_question_id_seq'::regclass)
public,service_question,created_by,character varying,NO,NULL
public,service_question,created_at,timestamp with time zone,NO,now()
public,service_question,updated_by,character varying,YES,NULL
public,service_question,updated_at,timestamp with time zone,YES,NULL
public,service_question,service_id,bigint,NO,NULL
public,service_question,question_id,bigint,NO,NULL
public,service_question,order_num,integer,NO,1
public,service_question,is_mandatory,boolean,NO,true
public,stripe_account,id,bigint,NO,nextval('stripe_account_id_seq'::regclass)
public,stripe_account,created_by,character varying,NO,NULL
public,stripe_account,created_at,timestamp with time zone,NO,now()
public,stripe_account,updated_by,character varying,YES,NULL
public,stripe_account,updated_at,timestamp with time zone,YES,NULL
public,stripe_account,app_user_id,bigint,NO,NULL
public,stripe_account,account_num,character varying,NO,NULL
public,vehicle,id,bigint,NO,nextval('vehicle_id_seq'::regclass)
public,vehicle,created_by,character varying,NO,NULL
public,vehicle,created_at,timestamp with time zone,NO,now()
public,vehicle,updated_by,character varying,YES,NULL
public,vehicle,updated_at,timestamp with time zone,YES,NULL
public,vehicle,manufacturer_id,bigint,YES,NULL
public,vehicle,model_id,bigint,YES,NULL
public,vehicle,company_id,bigint,YES,NULL
public,vehicle,vehicle_year,integer,YES,NULL
public,vehicle,vehicle_unit,character varying,YES,NULL
public,vehicle,vehicle_vin_serial,character varying,YES,NULL
public,vehicle,vehicle_mileage,numeric,YES,NULL
public,vehicle,vehicle_usdot,character varying,YES,NULL
public,vehicle,type_id,bigint,YES,NULL
public,vehicle_driver,id,bigint,NO,nextval('vehicle_driver_id_seq'::regclass)
public,vehicle_driver,created_by,character varying,NO,NULL
public,vehicle_driver,created_at,timestamp with time zone,NO,now()
public,vehicle_driver,updated_by,character varying,YES,NULL
public,vehicle_driver,updated_at,timestamp with time zone,YES,NULL
public,vehicle_driver,vehicle_id,bigint,NO,NULL
public,vehicle_driver,driver_id,bigint,NO,NULL
