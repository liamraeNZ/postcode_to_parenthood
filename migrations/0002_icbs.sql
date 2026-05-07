-- Populate the health_boards table with all UK care boards
-- Using INSERT OR IGNORE to ensure duplicates aren't created if re-run

INSERT OR IGNORE INTO health_boards (id, name, sub_board_code, parent_board_code, region, country, document_folder_name, created_at, updated_at) VALUES
-- Parent Integrated Care Boards (ICBs) - England
('QOX', 'NHS BATH AND NORTH EAST SOMERSET, SWINDON AND WILTSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-bath-and-north-east-somerset-swindon-and-wiltshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QHL', 'NHS BIRMINGHAM AND SOLIHULL INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-birmingham-and-solihull-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QUA', 'NHS BLACK COUNTRY INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-black-country-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QUY', 'NHS BRISTOL, NORTH SOMERSET AND SOUTH GLOUCESTERSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-bristol-north-somerset-and-south-gloucestershire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S1Y5D', 'NHS CENTRAL EAST INTEGRATED CARE BOARD', NULL, NULL, 'EAST OF ENGLAND', 'ENGLAND', 'nhs-central-east-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QYG', 'NHS CHESHIRE AND MERSEYSIDE INTEGRATED CARE BOARD', NULL, NULL, 'NORTH WEST', 'ENGLAND', 'nhs-cheshire-and-merseyside-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QT6', 'NHS CORNWALL AND THE ISLES OF SCILLY INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-cornwall-and-the-isles-of-scilly-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QWU', 'NHS COVENTRY AND WARWICKSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-coventry-and-warwickshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QJ2', 'NHS DERBY AND DERBYSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-derby-and-derbyshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QJK', 'NHS DEVON INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-devon-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QVV', 'NHS DORSET INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-dorset-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('D7T5G', 'NHS ESSEX INTEGRATED CARE BOARD', NULL, NULL, 'EAST OF ENGLAND', 'ENGLAND', 'nhs-essex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QR1', 'NHS GLOUCESTERSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-gloucestershire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QOP', 'NHS GREATER MANCHESTER INTEGRATED CARE BOARD', NULL, NULL, 'NORTH WEST', 'ENGLAND', 'nhs-greater-manchester-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QRL', 'NHS HAMPSHIRE AND ISLE OF WIGHT INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH EAST', 'ENGLAND', 'nhs-hampshire-and-isle-of-wight-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QGH', 'NHS HEREFORDSHIRE AND WORCESTERSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-herefordshire-and-worcestershire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QM7', 'NHS HERTFORDSHIRE AND WEST ESSEX INTEGRATED CARE BOARD', NULL, NULL, 'EAST OF ENGLAND', 'ENGLAND', 'nhs-hertfordshire-and-west-essex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QOQ', 'NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'NORTH EAST AND YORKSHIRE', 'ENGLAND', 'nhs-humber-and-north-yorkshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QKS', 'NHS KENT AND MEDWAY INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH EAST', 'ENGLAND', 'nhs-kent-and-medway-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QE1', 'NHS LANCASHIRE AND SOUTH CUMBRIA INTEGRATED CARE BOARD', NULL, NULL, 'NORTH WEST', 'ENGLAND', 'nhs-lancashire-and-south-cumbria-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QK1', 'NHS LEICESTER, LEICESTERSHIRE AND RUTLAND INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-leicester-leicestershire-and-rutland-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QJM', 'NHS LINCOLNSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-lincolnshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('T6Y0W', 'NHS NORFOLK AND SUFFOLK INTEGRATED CARE BOARD', NULL, NULL, 'EAST OF ENGLAND', 'ENGLAND', 'nhs-norfolk-and-suffolk-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QHM', 'NHS NORTH EAST AND NORTH CUMBRIA INTEGRATED CARE BOARD', NULL, NULL, 'NORTH EAST AND YORKSHIRE', 'ENGLAND', 'nhs-north-east-and-north-cumbria-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QMF', 'NHS NORTH EAST LONDON INTEGRATED CARE BOARD', NULL, NULL, 'LONDON', 'ENGLAND', 'nhs-north-east-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QPM', 'NHS NORTHAMPTONSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-northamptonshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QT1', 'NHS NOTTINGHAM AND NOTTINGHAMSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-nottingham-and-nottinghamshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QOC', 'NHS SHROPSHIRE, TELFORD AND WREKIN INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-shropshire-telford-and-wrekin-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QSL', 'NHS SOMERSET INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH WEST', 'ENGLAND', 'nhs-somerset-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QKK', 'NHS SOUTH EAST LONDON INTEGRATED CARE BOARD', NULL, NULL, 'LONDON', 'ENGLAND', 'nhs-south-east-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QWE', 'NHS SOUTH WEST LONDON INTEGRATED CARE BOARD', NULL, NULL, 'LONDON', 'ENGLAND', 'nhs-south-west-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QF7', 'NHS SOUTH YORKSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'NORTH EAST AND YORKSHIRE', 'ENGLAND', 'nhs-south-yorkshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QNC', 'NHS STAFFORDSHIRE AND STOKE-ON-TRENT INTEGRATED CARE BOARD', NULL, NULL, 'MIDLANDS', 'ENGLAND', 'nhs-staffordshire-and-stoke-on-trent-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S9B9J', 'NHS SURREY AND SUSSEX INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH EAST', 'ENGLAND', 'nhs-surrey-and-sussex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S0E4D', 'NHS THAMES VALLEY INTEGRATED CARE BOARD', NULL, NULL, 'SOUTH EAST', 'ENGLAND', 'nhs-thames-valley-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Z9B2Z', 'NHS WEST AND NORTH LONDON INTEGRATED CARE BOARD', NULL, NULL, 'LONDON', 'ENGLAND', 'nhs-west-and-north-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('QWO', 'NHS WEST YORKSHIRE INTEGRATED CARE BOARD', NULL, NULL, 'NORTH EAST AND YORKSHIRE', 'ENGLAND', 'nhs-west-yorkshire-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),

-- Sub-ICB Entities (London boroughs)
('W5Y6K', 'BARKING AND DAGENHAM - SUB-ICB REPORTING ENTITY', 'W5Y6K', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('G2L3T', 'BARNET - SUB-ICB REPORTING ENTITY', 'G2L3T', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Q0S2C', 'BEXLEY - SUB-ICB REPORTING ENTITY', 'Q0S2C', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('O4I9P', 'BRENT - SUB-ICB REPORTING ENTITY', 'O4I9P', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('K8B2G', 'BROMLEY - SUB-ICB REPORTING ENTITY', 'K8B2G', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('J0P1R', 'CAMDEN - SUB-ICB REPORTING ENTITY', 'J0P1R', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Z1H8A', 'CENTRAL LONDON - SUB-ICB REPORTING ENTITY', 'Z1H8A', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('A7V7E', 'CITY AND HACKNEY - SUB-ICB REPORTING ENTITY', 'A7V7E', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('L7N8K', 'CROYDON - SUB-ICB REPORTING ENTITY', 'L7N8K', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('J1I6Y', 'EALING - SUB-ICB REPORTING ENTITY', 'J1I6Y', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('U7R3S', 'ENFIELD - SUB-ICB REPORTING ENTITY', 'U7R3S', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('C3W4U', 'GREENWICH - SUB-ICB REPORTING ENTITY', 'C3W4U', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('R0W7N', 'HAMMERSMITH AND FULHAM - SUB-ICB REPORTING ENTITY', 'R0W7N', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('B1G9X', 'HARINGEY - SUB-ICB REPORTING ENTITY', 'B1G9X', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Y4U7N', 'HARROW - SUB-ICB REPORTING ENTITY', 'Y4U7N', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('E9S1I', 'HAVERING - SUB-ICB REPORTING ENTITY', 'E9S1I', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('L3J1B', 'HILLINGDON - SUB-ICB REPORTING ENTITY', 'L3J1B', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Z4H8X', 'HOUNSLOW - SUB-ICB REPORTING ENTITY', 'Z4H8X', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('D9P3T', 'ISLINGTON - SUB-ICB REPORTING ENTITY', 'D9P3T', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('Q6U7B', 'KINGSTON - SUB-ICB REPORTING ENTITY', 'Q6U7B', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('H1A0E', 'LAMBETH - SUB-ICB REPORTING ENTITY', 'H1A0E', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('O3P1D', 'LEWISHAM - SUB-ICB REPORTING ENTITY', 'O3P1D', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('P7F1Z', 'MERTON - SUB-ICB REPORTING ENTITY', 'P7F1Z', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('A4R1E', 'NEWHAM - SUB-ICB REPORTING ENTITY', 'A4R1E', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('I6C5L', 'REDBRIDGE - SUB-ICB REPORTING ENTITY', 'I6C5L', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('I1L7N', 'RICHMOND - SUB-ICB REPORTING ENTITY', 'I1L7N', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('D7Z1O', 'SOUTHWARK - SUB-ICB REPORTING ENTITY', 'D7Z1O', 'QKK', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('K2Q5Q', 'SUTTON - SUB-ICB REPORTING ENTITY', 'K2Q5Q', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S7H6Y', 'TOWER HAMLETS - SUB-ICB REPORTING ENTITY', 'S7H6Y', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('F7Z3N', 'WALTHAM FOREST - SUB-ICB REPORTING ENTITY', 'F7Z3N', 'QMF', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('G7G6U', 'WANDSWORTH - SUB-ICB REPORTING ENTITY', 'G7G6U', 'QWE', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('D2Z9S', 'WEST LONDON - SUB-ICB REPORTING ENTITY', 'D2Z9S', 'Z9B2Z', 'LONDON', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),

-- Sub-ICB Entities (non-London)
('M1J4Y', 'NHS BEDFORDSHIRE, LUTON AND MILTON KEYNES INTEGRATED CARE BOARD', 'M1J4Y', 'S1Y5D', 'EAST OF ENGLAND', 'ENGLAND', 'nhs-bedfordshire-luton-and-milton-keynes-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('06H', 'NHS CAMBRIDGESHIRE AND PETERBOROUGH INTEGRATED CARE BOARD', '06H', 'S1Y5D', 'EAST OF ENGLAND', 'ENGLAND', 'nhs-cambridgeshire-and-peterborough-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('06K', 'NHS CENTRAL EAST ICB - 06K', '06K', 'S1Y5D', 'EAST OF ENGLAND', 'ENGLAND', NULL, '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('99E', 'NHS MID AND SOUTH ESSEX INTEGRATED CARE BOARD', '99E', 'D7T5G', 'EAST OF ENGLAND', 'ENGLAND', 'nhs-mid-and-south-essex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('10Q', 'NHS BUCKINGHAMSHIRE, OXFORDSHIRE AND BERKSHIRE WEST INTEGRATED CARE BOARD', '10Q', 'S0E4D', 'SOUTH EAST', 'ENGLAND', 'nhs-buckinghamshire-oxfordshire-and-berkshire-west-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('D4U1Y', 'NHS FRIMLEY INTEGRATED CARE BOARD', 'D4U1Y', 'QRL', 'SOUTH EAST', 'ENGLAND', 'nhs-frimley-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('07P', 'NHS NORTH CENTRAL LONDON INTEGRATED CARE BOARD', '07P', 'Z9B2Z', 'LONDON', 'ENGLAND', 'nhs-north-central-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('08Y', 'NHS NORTH WEST LONDON INTEGRATED CARE BOARD', '08Y', 'Z9B2Z', 'LONDON', 'ENGLAND', 'nhs-north-west-london-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('92A', 'NHS SURREY HEARTLANDS INTEGRATED CARE BOARD', '92A', 'S9B9J', 'SOUTH EAST', 'ENGLAND', 'nhs-surrey-heartlands-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('09D', 'NHS SUSSEX INTEGRATED CARE BOARD', '09D', 'S9B9J', 'SOUTH EAST', 'ENGLAND', 'nhs-sussex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('06L', 'NHS NORFOLK AND WAVENEY INTEGRATED CARE BOARD', '06L', 'T6Y0W', 'EAST OF ENGLAND', 'ENGLAND', 'nhs-norfolk-and-waveney-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('07K', 'NHS SUFFOLK AND NORTH EAST ESSEX INTEGRATED CARE BOARD', '07K', 'T6Y0W', 'EAST OF ENGLAND', 'ENGLAND', 'nhs-suffolk-and-north-east-essex-integrated-care-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),

-- Scotland - NHS Health Boards (14)
('S08000015', 'NHS Ayrshire and Arran', NULL, NULL, 'West', 'SCOTLAND', 'nhs-ayrshire-and-arran', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000016', 'NHS Borders', NULL, NULL, 'South', 'SCOTLAND', 'nhs-borders', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000017', 'NHS Dumfries and Galloway', NULL, NULL, 'South', 'SCOTLAND', 'nhs-dumfries-and-galloway', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000029', 'NHS Fife', NULL, NULL, 'East', 'SCOTLAND', 'nhs-fife', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000019', 'NHS Forth Valley', NULL, NULL, 'Central', 'SCOTLAND', 'nhs-forth-valley', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000020', 'NHS Grampian', NULL, NULL, 'North', 'SCOTLAND', 'nhs-grampian', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000031', 'NHS Greater Glasgow and Clyde', NULL, NULL, 'West', 'SCOTLAND', 'nhs-greater-glasgow-and-clyde', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000022', 'NHS Highland', NULL, NULL, 'North', 'SCOTLAND', 'nhs-highland', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000032', 'NHS Lanarkshire', NULL, NULL, 'West', 'SCOTLAND', 'nhs-lanarkshire', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000024', 'NHS Lothian', NULL, NULL, 'East', 'SCOTLAND', 'nhs-lothian', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000025', 'NHS Orkney', NULL, NULL, 'Islands', 'SCOTLAND', 'nhs-orkney', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000026', 'NHS Shetland', NULL, NULL, 'Islands', 'SCOTLAND', 'nhs-shetland', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000030', 'NHS Tayside', NULL, NULL, 'East', 'SCOTLAND', 'nhs-tayside', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('S08000028', 'NHS Western Isles', NULL, NULL, 'Islands', 'SCOTLAND', 'nhs-western-isles', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),

-- Wales - Local Health Boards (7) — official ONS LHB23CD codes
('W11000023', 'Betsi Cadwaladr University Health Board', NULL, NULL, 'North', 'WALES', 'betsi-cadwaladr-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000024', 'Powys Teaching Health Board', NULL, NULL, 'Mid', 'WALES', 'powys-teaching-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000025', 'Hywel Dda University Health Board', NULL, NULL, 'West', 'WALES', 'hywel-dda-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000028', 'Aneurin Bevan University Health Board', NULL, NULL, 'South East', 'WALES', 'aneurin-bevan-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000029', 'Cardiff and Vale University Health Board', NULL, NULL, 'South', 'WALES', 'cardiff-and-vale-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000030', 'Cwm Taf Morgannwg University Health Board', NULL, NULL, 'South East', 'WALES', 'cwm-taf-morgannwg-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('W11000031', 'Swansea Bay University Health Board', NULL, NULL, 'South West', 'WALES', 'swansea-bay-university-health-board', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),

-- Northern Ireland - Health and Social Care Trusts (5)
('N09000003', 'Belfast HSC Trust', NULL, NULL, 'Belfast', 'NORTHERN_IRELAND', 'belfast-hsc-trust', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('N09000004', 'Northern HSC Trust', NULL, NULL, 'North', 'NORTHERN_IRELAND', 'northern-hsc-trust', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('N09000005', 'South Eastern HSC Trust', NULL, NULL, 'South East', 'NORTHERN_IRELAND', 'south-eastern-hsc-trust', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('N09000006', 'Southern HSC Trust', NULL, NULL, 'South', 'NORTHERN_IRELAND', 'southern-hsc-trust', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('N09000007', 'Western HSC Trust', NULL, NULL, 'West', 'NORTHERN_IRELAND', 'western-hsc-trust', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'); --> statement-breakpoint

-- ODS code aliases: map new ODS parent codes to existing sub-ICB rows
-- These ICBs were re-coded in April 2026 but the sub-ICB rows hold the policies and documents
INSERT OR IGNORE INTO board_aliases (id, board_id, alias_kind, alias, created_at, updated_at) VALUES
('alias-qhg', 'M1J4Y', 'code', 'QHG', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qh8', '99E', 'code', 'QH8', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qmm', '06L', 'code', 'QMM', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qmj', '07P', 'code', 'QMJ', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qjg', '07K', 'code', 'QJG', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-que', '06H', 'code', 'QUE', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qu9', '10Q', 'code', 'QU9', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qnq', 'D4U1Y', 'code', 'QNQ', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qrv', '08Y', 'code', 'QRV', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qxu', '92A', 'code', 'QXU', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),
('alias-qnx', '09D', 'code', 'QNX', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'); --> statement-breakpoint

-- Postcode area to board mappings for devolved nations
-- These map postcodes.io response field values to health board IDs
-- Scotland: lookup_field = 'nhs_ha' (postcodes.io nhs_ha field)
-- Wales: lookup_field = 'nhs_ha' (postcodes.io nhs_ha field)
-- Northern Ireland: lookup_field = 'primary_care_trust' (postcodes.io primary_care_trust field)

INSERT OR IGNORE INTO postcode_area_to_board (id, lookup_value, lookup_field, board_id, country) VALUES
-- Scotland (14 Health Boards) - nhs_ha values from postcodes.io
('pab-scotland-ayrshire-arran', 'Ayrshire and Arran', 'nhs_ha', 'S08000015', 'SCOTLAND'),
('pab-scotland-borders', 'Borders', 'nhs_ha', 'S08000016', 'SCOTLAND'),
('pab-scotland-dumfries-galloway', 'Dumfries and Galloway', 'nhs_ha', 'S08000017', 'SCOTLAND'),
('pab-scotland-fife', 'Fife', 'nhs_ha', 'S08000029', 'SCOTLAND'),
('pab-scotland-forth-valley', 'Forth Valley', 'nhs_ha', 'S08000019', 'SCOTLAND'),
('pab-scotland-grampian', 'Grampian', 'nhs_ha', 'S08000020', 'SCOTLAND'),
('pab-scotland-greater-glasgow-clyde', 'Greater Glasgow and Clyde', 'nhs_ha', 'S08000031', 'SCOTLAND'),
('pab-scotland-highland', 'Highland', 'nhs_ha', 'S08000022', 'SCOTLAND'),
('pab-scotland-lanarkshire', 'Lanarkshire', 'nhs_ha', 'S08000032', 'SCOTLAND'),
('pab-scotland-lothian', 'Lothian', 'nhs_ha', 'S08000024', 'SCOTLAND'),
('pab-scotland-orkney', 'Orkney', 'nhs_ha', 'S08000025', 'SCOTLAND'),
('pab-scotland-shetland', 'Shetland', 'nhs_ha', 'S08000026', 'SCOTLAND'),
('pab-scotland-tayside', 'Tayside', 'nhs_ha', 'S08000030', 'SCOTLAND'),
('pab-scotland-western-isles', 'Western Isles', 'nhs_ha', 'S08000028', 'SCOTLAND'),

-- Wales (7 Local Health Boards) - nhs_ha values from postcodes.io, official ONS LHB23CD codes
('pab-wales-betsi-cadwaladr', 'Betsi Cadwaladr University Health Board', 'nhs_ha', 'W11000023', 'WALES'),
('pab-wales-powys', 'Powys Teaching Health Board', 'nhs_ha', 'W11000024', 'WALES'),
('pab-wales-hywel-dda', 'Hywel Dda University Health Board', 'nhs_ha', 'W11000025', 'WALES'),
('pab-wales-aneurin-bevan', 'Aneurin Bevan University Health Board', 'nhs_ha', 'W11000028', 'WALES'),
('pab-wales-cardiff-vale', 'Cardiff and Vale University Health Board', 'nhs_ha', 'W11000029', 'WALES'),
('pab-wales-cwm-taf-morgannwg', 'Cwm Taf Morgannwg University Health Board', 'nhs_ha', 'W11000030', 'WALES'),
('pab-wales-swansea-bay', 'Swansea Bay University Health Board', 'nhs_ha', 'W11000031', 'WALES'),

-- Northern Ireland (5 HSC Trusts) - primary_care_trust values from postcodes.io
('pab-ni-belfast', 'Belfast', 'primary_care_trust', 'N09000003', 'NORTHERN_IRELAND'),
('pab-ni-northern', 'Northern', 'primary_care_trust', 'N09000004', 'NORTHERN_IRELAND'),
('pab-ni-south-eastern', 'South Eastern', 'primary_care_trust', 'N09000005', 'NORTHERN_IRELAND'),
('pab-ni-southern', 'Southern', 'primary_care_trust', 'N09000006', 'NORTHERN_IRELAND'),
('pab-ni-western', 'Western', 'primary_care_trust', 'N09000007', 'NORTHERN_IRELAND');
