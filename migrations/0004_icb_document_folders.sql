-- Map ICB records to their R2 folder name under policies/

UPDATE icbs SET document_folder_name = 'Bath and North East Somerset, Swindon and Wiltshire' WHERE id = 'QOX'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Bedfordshire, Luton and Milton Keynes' WHERE sub_icb_code = 'M1J4Y'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Birmingham and Solihull' WHERE id = 'QHL'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Black Country' WHERE id = 'QUA'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Bristol, North Somerset and South Gloucestershire' WHERE id = 'QUY'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Buckinghamshire, Oxfordshire and Berkshire West' WHERE sub_icb_code = '10Q'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Cambridgeshire and Peterborough' WHERE sub_icb_code = '06H'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Cornwall and the Isles of Scilly' WHERE id = 'QT6'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Coventry and Warwickshire' WHERE id = 'QWU'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Derby and Derbyshire' WHERE id = 'QJ2'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Devon' WHERE id = 'QJK'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Dorset' WHERE id = 'QVV'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Frimley' WHERE sub_icb_code = 'D4U1Y'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Gloucestershire' WHERE id = 'QR1'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Hampshire and Isle of Wight' WHERE id = 'QRL'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Herefordshire and Worcestershire' WHERE id = 'QGH'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Hertfordshire and West Essex' WHERE id = 'QM7'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Kent and Medway' WHERE id = 'QKS'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Lancashire and South Cumbria' WHERE id = 'QE1'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Lincolnshire' WHERE id = 'QJM'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Mid and South Essex' WHERE sub_icb_code = '99E'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Norfolk and Waveney' WHERE sub_icb_code = '06L'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'North Central London' WHERE sub_icb_code = '07P'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'North East and North Cumbria' WHERE id = 'QHM'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'North East London' WHERE id = 'QMF'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'North West London' WHERE sub_icb_code = '08Y'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Northamptonshire' WHERE id = 'QPM'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Nottingham and Nottinghamshire' WHERE id = 'QT1'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Shropshire, Telford and Wrekin' WHERE id = 'QOC'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Somerset' WHERE id = 'QSL'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'South East London' WHERE id = 'QKK'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'South West London' WHERE id = 'QWE'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'South Yorkshire' WHERE id = 'QF7'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Staffordshire and Stoke-on-Trent' WHERE id = 'QNC'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Suffolk and North East Essex' WHERE sub_icb_code = '07K'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Surrey Heartlands' WHERE sub_icb_code = '92A'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Sussex' WHERE sub_icb_code = '09D'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'West Yorkshire' WHERE id = 'QWO';

CREATE INDEX IF NOT EXISTS icbs_document_folder_name_idx
  ON icbs (document_folder_name)
  WHERE document_folder_name IS NOT NULL;