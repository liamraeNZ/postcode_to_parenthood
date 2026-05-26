-- Seed boroughs/areas covered for all health boards (SEO: helps users find their ICB by local area name)
-- Format: { "boroughs": [...], "neighbourhoods": [...] }
-- boroughs = official local authority areas; neighbourhoods = smaller areas for long-tail SEO

-- ============================================================
-- LONDON ICBs (with neighbourhood-level data for SEO)
-- ============================================================

-- NHS North East London ICB (QMF)
UPDATE health_boards
SET boroughs = '{"boroughs":["Barking and Dagenham","City of London","Hackney","Havering","Newham","Redbridge","Tower Hamlets","Waltham Forest"],"neighbourhoods":["Shoreditch","Bethnal Green","Bow","Mile End","Whitechapel","Stepney","Poplar","Limehouse","Canary Wharf","Isle of Dogs","Stratford","West Ham","East Ham","Plaistow","Manor Park","Forest Gate","Ilford","Wanstead","Woodford","Chingford","Leyton","Leytonstone","Walthamstow","Romford","Hornchurch","Upminster","Rainham","Dagenham","Barking"]}'
WHERE id = 'QMF';

-- NHS South East London ICB (QKK)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bexley","Bromley","Greenwich","Lambeth","Lewisham","Southwark"],"neighbourhoods":["Sydenham","Crystal Palace","Forest Hill","Catford","Deptford","New Cross","Brockley","Hither Green","Lee","Blackheath","Peckham","Camberwell","Dulwich","Bermondsey","Rotherhithe","Elephant and Castle","Walworth","Brixton","Streatham","Herne Hill","Clapham","Kennington","Vauxhall","Woolwich","Eltham","Charlton","Plumstead","Thamesmead","Welling","Bexleyheath","Erith","Sidcup","Beckenham","Penge","Orpington","Chislehurst","Bromley Common","West Wickham"]}'
WHERE id = 'QKK';

-- NHS South West London ICB (QWE)
UPDATE health_boards
SET boroughs = '{"boroughs":["Croydon","Kingston upon Thames","Merton","Richmond upon Thames","Sutton","Wandsworth"],"neighbourhoods":["Wimbledon","Mitcham","Morden","Colliers Wood","Tooting","Balham","Putney","Battersea","Clapham Junction","Norbury","Thornton Heath","South Croydon","Purley","Coulsdon","New Malden","Surbiton","Teddington","Twickenham","Hampton","Cheam","Carshalton","Wallington","Roehampton","Barnes","East Sheen","Mortlake"]}'
WHERE id = 'QWE';

-- NHS West and North London ICB (Z9B2Z) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Barnet","Brent","Camden","Ealing","Enfield","Hammersmith and Fulham","Haringey","Harrow","Hillingdon","Hounslow","Islington","Kensington and Chelsea","Westminster"],"neighbourhoods":["Finchley","Hendon","Edgware","Mill Hill","Wembley","Kilburn","Willesden","Neasden","Cricklewood","Kentish Town","Hampstead","Holloway","Kings Cross","Bloomsbury","Acton","Southall","Greenford","Hanwell","Northolt","Palmers Green","Southgate","Edmonton","Winchmore Hill","Tottenham","Muswell Hill","Crouch End","Hornsey","Wood Green","Pinner","Stanmore","Wealdstone","Uxbridge","Hayes","Ruislip","Northwood","Chiswick","Brentford","Isleworth","Feltham","Shepherds Bush","Fulham","Notting Hill","Paddington","Marylebone","Soho","Mayfair","Pimlico","Angel","Highbury","Finsbury Park"]}'
WHERE id = 'Z9B2Z';

-- ============================================================
-- ENGLAND — NON-LONDON ICBs (boroughs only, no neighbourhoods for now)
-- ============================================================

-- NHS Bath and North East Somerset, Swindon and Wiltshire ICB (QOX)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bath","North East Somerset","Swindon","Wiltshire"],"neighbourhoods":[]}'
WHERE id = 'QOX';

-- NHS Birmingham and Solihull ICB (QHL)
UPDATE health_boards
SET boroughs = '{"boroughs":["Birmingham","Solihull"],"neighbourhoods":["Edgbaston","Erdington","Hall Green","Hodge Hill","Ladywood","Northfield","Perry Barr","Selly Oak","Sutton Coldfield","Yardley","Kings Heath","Moseley","Bournville","Harborne","Acocks Green","Small Heath","Sparkbrook","Handsworth"]}'
WHERE id = 'QHL';

-- NHS Black Country ICB (QUA)
UPDATE health_boards
SET boroughs = '{"boroughs":["Dudley","Sandwell","Walsall","Wolverhampton"],"neighbourhoods":["Stourbridge","Halesowen","Brierley Hill","West Bromwich","Smethwick","Oldbury","Tipton","Wednesbury","Aldridge","Bloxwich","Brownhills","Willenhall","Bilston","Wednesfield","Tettenhall"]}'
WHERE id = 'QUA';

-- NHS Bristol, North Somerset and South Gloucestershire ICB (QUY)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bristol","North Somerset","South Gloucestershire"],"neighbourhoods":["Clifton","Redland","Bedminster","Southville","Bishopston","Horfield","Filton","Bradley Stoke","Kingswood","Weston-super-Mare","Clevedon","Portishead","Nailsea"]}'
WHERE id = 'QUY';

-- NHS Central East ICB (S1Y5D) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Bedfordshire","Luton","Milton Keynes","Cambridgeshire","Peterborough","Hertfordshire","West Essex"],"neighbourhoods":[]}'
WHERE id = 'S1Y5D';

-- NHS Cheshire and Merseyside ICB (QYG)
UPDATE health_boards
SET boroughs = '{"boroughs":["Cheshire East","Cheshire West and Chester","Halton","Knowsley","Liverpool","Sefton","St Helens","Warrington","Wirral"],"neighbourhoods":["Crewe","Macclesfield","Chester","Ellesmere Port","Northwich","Widnes","Runcorn","Huyton","Kirkby","Prescot","Bootle","Crosby","Formby","Southport","Birkenhead","Wallasey","Bebington","Heswall"]}'
WHERE id = 'QYG';

-- NHS Cornwall and the Isles of Scilly ICB (QT6)
UPDATE health_boards
SET boroughs = '{"boroughs":["Cornwall","Isles of Scilly"],"neighbourhoods":["Truro","Falmouth","Penzance","Newquay","St Austell","Bodmin","Camborne","Redruth","St Ives","Helston","Bude","Launceston","Padstow"]}'
WHERE id = 'QT6';

-- NHS Coventry and Warwickshire ICB (QWU)
UPDATE health_boards
SET boroughs = '{"boroughs":["Coventry","Warwickshire","North Warwickshire","Nuneaton and Bedworth","Rugby","Stratford-on-Avon","Warwick"],"neighbourhoods":["Leamington Spa","Kenilworth","Bedworth","Atherstone","Alcester","Shipston-on-Stour","Southam"]}'
WHERE id = 'QWU';

-- NHS Derby and Derbyshire ICB (QJ2)
UPDATE health_boards
SET boroughs = '{"boroughs":["Derby","Amber Valley","Bolsover","Chesterfield","Derbyshire Dales","Erewash","High Peak","North East Derbyshire","South Derbyshire"],"neighbourhoods":["Belper","Ripley","Heanor","Ilkeston","Long Eaton","Buxton","Glossop","Matlock","Bakewell","Swadlincote","Dronfield"]}'
WHERE id = 'QJ2';

-- NHS Devon ICB (QJK)
UPDATE health_boards
SET boroughs = '{"boroughs":["Devon","Exeter","Plymouth","Torbay","East Devon","Mid Devon","North Devon","South Hams","Teignbridge","Torridge","West Devon"],"neighbourhoods":["Exmouth","Sidmouth","Barnstaple","Ilfracombe","Bideford","Torquay","Paignton","Brixham","Newton Abbot","Dawlish","Teignmouth","Tavistock","Okehampton","Ivybridge","Kingsbridge","Crediton","Tiverton"]}'
WHERE id = 'QJK';

-- NHS Dorset ICB (QVV)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bournemouth","Christchurch","Poole","Dorset"],"neighbourhoods":["Weymouth","Dorchester","Bridport","Sherborne","Blandford Forum","Wimborne Minster","Swanage","Wareham","Ferndown","Verwood"]}'
WHERE id = 'QVV';

-- NHS Essex ICB (D7T5G) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Basildon","Braintree","Brentwood","Castle Point","Chelmsford","Colchester","Epping Forest","Harlow","Maldon","Rochford","Southend-on-Sea","Tendring","Thurrock","Uttlesford"],"neighbourhoods":["Billericay","Wickford","Laindon","Witham","Halstead","Rayleigh","Canvey Island","Benfleet","Grays","Tilbury","Stanford-le-Hope","Clacton-on-Sea","Frinton-on-Sea","Walton-on-the-Naze","Saffron Walden","Great Dunmow"]}'
WHERE id = 'D7T5G';

-- NHS Gloucestershire ICB (QR1)
UPDATE health_boards
SET boroughs = '{"boroughs":["Cheltenham","Cotswold","Forest of Dean","Gloucester","Stroud","Tewkesbury"],"neighbourhoods":["Cirencester","Stow-on-the-Wold","Moreton-in-Marsh","Cinderford","Lydney","Coleford","Dursley","Nailsworth","Stonehouse","Bishops Cleeve"]}'
WHERE id = 'QR1';

-- NHS Greater Manchester ICB (QOP)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bolton","Bury","Manchester","Oldham","Rochdale","Salford","Stockport","Tameside","Trafford","Wigan"],"neighbourhoods":["Didsbury","Chorlton","Fallowfield","Withington","Levenshulme","Gorton","Moss Side","Hulme","Ancoats","Prestwich","Whitefield","Radcliffe","Middleton","Heywood","Littleborough","Ashton-under-Lyne","Stalybridge","Hyde","Denton","Droylsden","Altrincham","Sale","Stretford","Urmston","Leigh","Atherton","Hindley","Cheadle","Bramhall","Marple","Hazel Grove","Eccles","Swinton","Walkden","Worsley","Irlam"]}'
WHERE id = 'QOP';

-- NHS Hampshire and Isle of Wight ICB (QRL)
UPDATE health_boards
SET boroughs = '{"boroughs":["Basingstoke and Deane","East Hampshire","Eastleigh","Fareham","Gosport","Hart","Havant","Isle of Wight","New Forest","Portsmouth","Rushmoor","Southampton","Test Valley","Winchester"],"neighbourhoods":["Aldershot","Farnborough","Fleet","Andover","Romsey","Lymington","Totton","Hythe","Newport","Ryde","Cowes","Sandown","Shanklin","Ventnor","Petersfield","Alton","Waterlooville","Hayling Island","Emsworth"]}'
WHERE id = 'QRL';

-- NHS Herefordshire and Worcestershire ICB (QGH)
UPDATE health_boards
SET boroughs = '{"boroughs":["Herefordshire","Bromsgrove","Malvern Hills","Redditch","Worcester","Wychavon","Wyre Forest"],"neighbourhoods":["Hereford","Leominster","Ross-on-Wye","Ledbury","Kidderminster","Stourport-on-Severn","Bewdley","Evesham","Pershore","Droitwich Spa","Great Malvern"]}'
WHERE id = 'QGH';

-- NHS Hertfordshire and West Essex ICB (QM7)
UPDATE health_boards
SET boroughs = '{"boroughs":["Broxbourne","Dacorum","East Hertfordshire","Hertsmere","North Hertfordshire","St Albans","Stevenage","Three Rivers","Watford","Welwyn Hatfield"],"neighbourhoods":["Hemel Hempstead","Berkhamsted","Tring","Bishops Stortford","Ware","Hertford","Hoddesdon","Cheshunt","Borehamwood","Elstree","Potters Bar","Hitchin","Letchworth","Baldock","Royston","Rickmansworth","Chorleywood","Hatfield","Welwyn Garden City","Harpenden"]}'
WHERE id = 'QM7';

-- NHS Humber and North Yorkshire ICB (QOQ)
UPDATE health_boards
SET boroughs = '{"boroughs":["East Riding of Yorkshire","Kingston upon Hull","North East Lincolnshire","North Lincolnshire","Hambleton","Harrogate","Richmondshire","Ryedale","Scarborough","Selby","York"],"neighbourhoods":["Beverley","Bridlington","Goole","Driffield","Grimsby","Cleethorpes","Scunthorpe","Brigg","Barton-upon-Humber","Northallerton","Thirsk","Ripon","Knaresborough","Richmond","Whitby","Malton","Pickering","Filey"]}'
WHERE id = 'QOQ';

-- NHS Kent and Medway ICB (QKS)
UPDATE health_boards
SET boroughs = '{"boroughs":["Ashford","Canterbury","Dartford","Dover","Folkestone and Hythe","Gravesham","Maidstone","Medway","Sevenoaks","Swale","Thanet","Tonbridge and Malling","Tunbridge Wells"],"neighbourhoods":["Chatham","Rochester","Gillingham","Strood","Sittingbourne","Faversham","Sheerness","Margate","Ramsgate","Broadstairs","Herne Bay","Whitstable","Deal","Sandwich","Tenterden","Cranbrook","Paddock Wood","Edenbridge","Westerham","Gravesend","Northfleet","Swanley"]}'
WHERE id = 'QKS';

-- NHS Lancashire and South Cumbria ICB (QE1)
UPDATE health_boards
SET boroughs = '{"boroughs":["Barrow-in-Furness","Blackburn with Darwen","Blackpool","Burnley","Chorley","Fylde","Hyndburn","Lancaster","Pendle","Preston","Ribble Valley","Rossendale","South Lakeland","South Ribble","West Lancashire","Wyre"],"neighbourhoods":["Accrington","Clitheroe","Colne","Nelson","Rawtenstall","Haslingden","Bacup","Leyland","Penwortham","Lytham St Annes","Fleetwood","Cleveleys","Thornton","Morecambe","Carnforth","Kendal","Ulverston","Skelmersdale","Ormskirk"]}'
WHERE id = 'QE1';

-- NHS Leicester, Leicestershire and Rutland ICB (QK1)
UPDATE health_boards
SET boroughs = '{"boroughs":["Leicester","Blaby","Charnwood","Harborough","Hinckley and Bosworth","Melton","North West Leicestershire","Oadby and Wigston","Rutland"],"neighbourhoods":["Loughborough","Coalville","Ashby-de-la-Zouch","Market Harborough","Lutterworth","Hinckley","Melton Mowbray","Oakham","Uppingham","Wigston","Oadby","Syston","Birstall","Mountsorrel"]}'
WHERE id = 'QK1';

-- NHS Lincolnshire ICB (QJM)
UPDATE health_boards
SET boroughs = '{"boroughs":["Boston","East Lindsey","Lincoln","North Kesteven","South Holland","South Kesteven","West Lindsey"],"neighbourhoods":["Skegness","Mablethorpe","Louth","Horncastle","Sleaford","Spalding","Holbeach","Grantham","Stamford","Bourne","Market Rasen","Gainsborough","Caistor"]}'
WHERE id = 'QJM';

-- NHS Norfolk and Suffolk ICB (T6Y0W) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Norwich","Great Yarmouth","King''s Lynn","Breckland","Broadland","North Norfolk","South Norfolk","Ipswich","Lowestoft","Bury St Edmunds","Felixstowe","Sudbury","Colchester","Clacton-on-Sea"],"neighbourhoods":["Dereham","Thetford","Attleborough","Wymondham","Cromer","Sheringham","Fakenham","Wells-next-the-Sea","Hunstanton","Downham Market","Swaffham","Diss","Harleston","Beccles","Bungay","Halesworth","Southwold","Aldeburgh","Woodbridge","Stowmarket","Needham Market","Hadleigh","Haverhill","Newmarket","Mildenhall","Brandon"]}'
WHERE id = 'T6Y0W';

-- NHS North East and North Cumbria ICB (QHM)
UPDATE health_boards
SET boroughs = '{"boroughs":["County Durham","Darlington","Gateshead","Hartlepool","Middlesbrough","Newcastle upon Tyne","North Tyneside","Northumberland","Redcar and Cleveland","South Tyneside","Stockton-on-Tees","Sunderland","Allerdale","Carlisle","Copeland","Eden"],"neighbourhoods":["Durham","Bishop Auckland","Newton Aycliffe","Consett","Chester-le-Street","Seaham","Peterlee","Whitley Bay","Tynemouth","Wallsend","Cramlington","Blyth","Ashington","Morpeth","Hexham","Alnwick","Berwick-upon-Tweed","Whitehaven","Workington","Penrith","Guisborough","Saltburn","Yarm","Billingham","Washington","Houghton-le-Spring","Jarrow","South Shields","Jesmond","Gosforth","Heaton"]}'
WHERE id = 'QHM';

-- NHS Northamptonshire ICB (QPM)
UPDATE health_boards
SET boroughs = '{"boroughs":["Corby","Daventry","East Northamptonshire","Kettering","Northampton","South Northamptonshire","Wellingborough"],"neighbourhoods":["Rushden","Higham Ferrers","Irthlingborough","Raunds","Thrapston","Oundle","Towcester","Brackley","Desborough","Rothwell","Burton Latimer"]}'
WHERE id = 'QPM';

-- NHS Nottingham and Nottinghamshire ICB (QT1)
UPDATE health_boards
SET boroughs = '{"boroughs":["Nottingham","Ashfield","Bassetlaw","Broxtowe","Gedling","Mansfield","Newark and Sherwood","Rushcliffe"],"neighbourhoods":["Beeston","Stapleford","Arnold","Carlton","Hucknall","Kirkby-in-Ashfield","Sutton-in-Ashfield","Worksop","Retford","Newark-on-Trent","Southwell","Bingham","West Bridgford","Mansfield Woodhouse","Ollerton","Eastwood"]}'
WHERE id = 'QT1';

-- NHS Shropshire, Telford and Wrekin ICB (QOC)
UPDATE health_boards
SET boroughs = '{"boroughs":["Shropshire","Telford and Wrekin"],"neighbourhoods":["Shrewsbury","Oswestry","Bridgnorth","Ludlow","Market Drayton","Whitchurch","Wem","Church Stretton","Much Wenlock","Wellington","Dawley","Madeley","Oakengates","Newport"]}'
WHERE id = 'QOC';

-- NHS Somerset ICB (QSL)
UPDATE health_boards
SET boroughs = '{"boroughs":["Mendip","Sedgemoor","South Somerset","Somerset West and Taunton"],"neighbourhoods":["Taunton","Bridgwater","Yeovil","Frome","Glastonbury","Street","Wells","Shepton Mallet","Chard","Crewkerne","Ilminster","Burnham-on-Sea","Highbridge","Minehead","Wellington","Wincanton"]}'
WHERE id = 'QSL';

-- NHS South Yorkshire ICB (QF7)
UPDATE health_boards
SET boroughs = '{"boroughs":["Barnsley","Doncaster","Rotherham","Sheffield"],"neighbourhoods":["Wombwell","Penistone","Goldthorpe","Mexborough","Conisbrough","Thorne","Bawtry","Tickhill","Maltby","Wath upon Dearne","Swinton","Chapeltown","Stocksbridge","Hillsborough","Ecclesall","Dore","Totley","Woodseats","Crookes","Walkley"]}'
WHERE id = 'QF7';

-- NHS Staffordshire and Stoke-on-Trent ICB (QNC)
UPDATE health_boards
SET boroughs = '{"boroughs":["Cannock Chase","East Staffordshire","Lichfield","Newcastle-under-Lyme","South Staffordshire","Stafford","Staffordshire Moorlands","Stoke-on-Trent","Tamworth"],"neighbourhoods":["Cannock","Rugeley","Burton upon Trent","Uttoxeter","Burntwood","Kidsgrove","Stone","Leek","Cheadle","Biddulph","Hanley","Burslem","Tunstall","Longton","Fenton"]}'
WHERE id = 'QNC';

-- NHS Surrey and Sussex ICB (S9B9J) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Elmbridge","Epsom and Ewell","Guildford","Mole Valley","Reigate and Banstead","Runnymede","Spelthorne","Surrey Heath","Tandridge","Waverley","Woking","Adur","Arun","Chichester","Crawley","Horsham","Mid Sussex","Worthing","Brighton and Hove","Eastbourne","Hastings","Lewes","Rother","Wealden"],"neighbourhoods":["Weybridge","Walton-on-Thames","Esher","Cobham","Epsom","Dorking","Leatherhead","Redhill","Reigate","Horley","Camberley","Frimley","Staines","Sunbury","Godalming","Farnham","Haslemere","Cranleigh","Shoreham-by-Sea","Lancing","Littlehampton","Bognor Regis","Burgess Hill","Haywards Heath","East Grinstead","Hove","Portslade","Rottingdean","Peacehaven","Newhaven","Seaford","Bexhill-on-Sea","Battle","Rye","Crowborough","Uckfield","Hailsham","Heathfield"]}'
WHERE id = 'S9B9J';

-- NHS Thames Valley ICB (S0E4D) — merged April 2026
UPDATE health_boards
SET boroughs = '{"boroughs":["Aylesbury Vale","Chiltern","South Bucks","Wycombe","Cherwell","Oxford","South Oxfordshire","Vale of White Horse","West Oxfordshire","Bracknell Forest","Reading","Slough","West Berkshire","Windsor and Maidenhead","Wokingham"],"neighbourhoods":["Aylesbury","Buckingham","Wendover","Amersham","Chesham","Beaconsfield","Gerrards Cross","High Wycombe","Marlow","Princes Risborough","Banbury","Bicester","Kidlington","Witney","Carterton","Chipping Norton","Abingdon","Wantage","Didcot","Henley-on-Thames","Wallingford","Thame","Newbury","Hungerford","Thatcham","Maidenhead","Windsor","Ascot","Woodley","Earley","Wokingham","Crowthorne","Sandhurst","Burnham","Iver","Langley"]}'
WHERE id = 'S0E4D';

-- NHS West Yorkshire ICB (QWO)
UPDATE health_boards
SET boroughs = '{"boroughs":["Bradford","Calderdale","Kirklees","Leeds","Wakefield"],"neighbourhoods":["Keighley","Shipley","Bingley","Ilkley","Halifax","Todmorden","Brighouse","Elland","Sowerby Bridge","Huddersfield","Dewsbury","Batley","Cleckheaton","Mirfield","Holmfirth","Headingley","Horsforth","Morley","Pudsey","Otley","Wetherby","Garforth","Rothwell","Pontefract","Castleford","Normanton","Ossett","Horbury","Featherstone","Knottingley"]}'
WHERE id = 'QWO';

-- ============================================================
-- SCOTLAND — NHS Health Boards
-- ============================================================

UPDATE health_boards
SET boroughs = '{"boroughs":["East Ayrshire","North Ayrshire","South Ayrshire","Arran"],"neighbourhoods":["Kilmarnock","Irvine","Ayr","Troon","Prestwick","Kilwinning","Ardrossan","Saltcoats","Largs","Cumnock","Mauchline","Stewarton"]}'
WHERE id = 'S08000015';

UPDATE health_boards
SET boroughs = '{"boroughs":["Scottish Borders"],"neighbourhoods":["Hawick","Galashiels","Kelso","Peebles","Jedburgh","Melrose","Selkirk","Duns","Eyemouth","Coldstream","Innerleithen"]}'
WHERE id = 'S08000016';

UPDATE health_boards
SET boroughs = '{"boroughs":["Dumfries and Galloway"],"neighbourhoods":["Dumfries","Annan","Stranraer","Castle Douglas","Kirkcudbright","Lockerbie","Moffat","Dalbeattie","Newton Stewart","Wigtown","Langholm","Sanquhar","Thornhill"]}'
WHERE id = 'S08000017';

UPDATE health_boards
SET boroughs = '{"boroughs":["Fife"],"neighbourhoods":["Dunfermline","Kirkcaldy","Glenrothes","St Andrews","Cupar","Cowdenbeath","Leven","Methil","Buckhaven","Burntisland","Inverkeithing","Dalgety Bay","Rosyth","Lochgelly","Anstruther"]}'
WHERE id = 'S08000029';

UPDATE health_boards
SET boroughs = '{"boroughs":["Falkirk","Stirling","Clackmannanshire"],"neighbourhoods":["Grangemouth","Bo''ness","Denny","Bonnybridge","Larbert","Stenhousemuir","Alloa","Tillicoultry","Dollar","Alva","Bridge of Allan","Dunblane","Callander","Bannockburn"]}'
WHERE id = 'S08000019';

UPDATE health_boards
SET boroughs = '{"boroughs":["Aberdeen","Aberdeenshire","Moray"],"neighbourhoods":["Peterhead","Fraserburgh","Inverurie","Ellon","Stonehaven","Banchory","Westhill","Elgin","Forres","Buckie","Keith","Lossiemouth","Huntly","Turriff","Banff","Macduff"]}'
WHERE id = 'S08000020';

UPDATE health_boards
SET boroughs = '{"boroughs":["Glasgow","East Dunbartonshire","West Dunbartonshire","East Renfrewshire","Renfrewshire","Inverclyde"],"neighbourhoods":["Bearsden","Milngavie","Kirkintilloch","Bishopbriggs","Clydebank","Dumbarton","Alexandria","Giffnock","Newton Mearns","Clarkston","Barrhead","Paisley","Renfrew","Johnstone","Erskine","Greenock","Port Glasgow","Gourock","Partick","Maryhill","Shawlands","Pollokshields","Dennistoun","Springburn","Govan","Ibrox"]}'
WHERE id = 'S08000031';

UPDATE health_boards
SET boroughs = '{"boroughs":["Highland","Argyll and Bute"],"neighbourhoods":["Inverness","Fort William","Oban","Thurso","Wick","Dingwall","Tain","Invergordon","Alness","Nairn","Aviemore","Kingussie","Fort Augustus","Portree","Kyle of Lochalsh","Ullapool","Dunoon","Helensburgh","Campbeltown","Lochgilphead","Rothesay"]}'
WHERE id = 'S08000022';

UPDATE health_boards
SET boroughs = '{"boroughs":["North Lanarkshire","South Lanarkshire"],"neighbourhoods":["Motherwell","Hamilton","East Kilbride","Coatbridge","Airdrie","Wishaw","Bellshill","Cumbernauld","Kilsyth","Shotts","Carluke","Lanark","Larkhall","Strathaven","Biggar","Cambuslang","Rutherglen","Blantyre","Uddingston"]}'
WHERE id = 'S08000032';

UPDATE health_boards
SET boroughs = '{"boroughs":["Edinburgh","West Lothian","East Lothian","Midlothian"],"neighbourhoods":["Livingston","Bathgate","Linlithgow","Broxburn","Whitburn","Armadale","Musselburgh","Haddington","North Berwick","Dunbar","Tranent","Prestonpans","Dalkeith","Bonnyrigg","Penicuik","Loanhead","Roslin","Leith","Morningside","Stockbridge","Portobello","Corstorphine","Gorgie","Cramond"]}'
WHERE id = 'S08000024';

UPDATE health_boards
SET boroughs = '{"boroughs":["Orkney Islands"],"neighbourhoods":["Kirkwall","Stromness","Finstown","Dounby","St Margaret''s Hope"]}'
WHERE id = 'S08000025';

UPDATE health_boards
SET boroughs = '{"boroughs":["Shetland Islands"],"neighbourhoods":["Lerwick","Scalloway","Brae","Sandwick"]}'
WHERE id = 'S08000026';

UPDATE health_boards
SET boroughs = '{"boroughs":["Dundee","Perth and Kinross","Angus"],"neighbourhoods":["Perth","Arbroath","Montrose","Forfar","Brechin","Kirriemuir","Carnoustie","Monifieth","Broughty Ferry","Blairgowrie","Crieff","Pitlochry","Aberfeldy","Kinross","Auchterarder"]}'
WHERE id = 'S08000030';

UPDATE health_boards
SET boroughs = '{"boroughs":["Western Isles"],"neighbourhoods":["Stornoway","Tarbert","Lochmaddy","Castlebay","Benbecula","Leverburgh"]}'
WHERE id = 'S08000028';

-- ============================================================
-- WALES — Local Health Boards
-- ============================================================

UPDATE health_boards
SET boroughs = '{"boroughs":["Anglesey","Gwynedd","Conwy","Denbighshire","Flintshire","Wrexham"],"neighbourhoods":["Holyhead","Llangefni","Bangor","Caernarfon","Porthmadog","Pwllheli","Blaenau Ffestiniog","Llandudno","Colwyn Bay","Abergele","Rhyl","Prestatyn","Denbigh","Ruthin","Corwen","Llangollen","Mold","Buckley","Connah''s Quay","Flint","Holywell","Shotton"]}'
WHERE id = 'W11000023';

UPDATE health_boards
SET boroughs = '{"boroughs":["Powys"],"neighbourhoods":["Brecon","Newtown","Welshpool","Llandrindod Wells","Builth Wells","Knighton","Presteigne","Machynlleth","Llanidloes","Ystradgynlais","Hay-on-Wye","Crickhowell"]}'
WHERE id = 'W11000024';

UPDATE health_boards
SET boroughs = '{"boroughs":["Carmarthenshire","Ceredigion","Pembrokeshire"],"neighbourhoods":["Carmarthen","Llanelli","Ammanford","Llandeilo","Kidwelly","Aberystwyth","Cardigan","Lampeter","Aberaeron","New Quay","Tregaron","Haverfordwest","Milford Haven","Pembroke","Pembroke Dock","Tenby","Fishguard","Narberth","Saundersfoot"]}'
WHERE id = 'W11000025';

UPDATE health_boards
SET boroughs = '{"boroughs":["Blaenau Gwent","Caerphilly","Monmouthshire","Newport","Torfaen"],"neighbourhoods":["Ebbw Vale","Tredegar","Brynmawr","Abertillery","Bargoed","Blackwood","Caerphilly","Risca","Newbridge","Abergavenny","Monmouth","Chepstow","Caldicot","Usk","Cwmbran","Pontypool","Blaenavon","Magor","Rogiet"]}'
WHERE id = 'W11000028';

UPDATE health_boards
SET boroughs = '{"boroughs":["Cardiff","Vale of Glamorgan"],"neighbourhoods":["Barry","Penarth","Cowbridge","Llantwit Major","Dinas Powys","Sully","Rhoose","Canton","Cathays","Roath","Splott","Grangetown","Riverside","Pontcanna","Whitchurch","Llandaff","Rhiwbina","Heath","Cyncoed","Penylan","Rumney","St Mellons","Ely","Caerau","Fairwater"]}'
WHERE id = 'W11000029';

UPDATE health_boards
SET boroughs = '{"boroughs":["Bridgend","Merthyr Tydfil","Rhondda Cynon Taf"],"neighbourhoods":["Porthcawl","Maesteg","Pencoed","Aberdare","Mountain Ash","Pontypridd","Treorchy","Tonypandy","Porth","Ferndale","Treherbert","Llantrisant","Tonyrefail","Church Village","Hirwaun","Dowlais"]}'
WHERE id = 'W11000030';

UPDATE health_boards
SET boroughs = '{"boroughs":["Swansea","Neath Port Talbot"],"neighbourhoods":["Mumbles","Gorseinon","Pontardawe","Clydach","Morriston","Sketty","Uplands","Brynmill","Port Talbot","Neath","Briton Ferry","Baglan","Resolven","Glynneath","Seven Sisters","Skewen"]}'
WHERE id = 'W11000031';

-- ============================================================
-- NORTHERN IRELAND — HSC Trusts
-- ============================================================

UPDATE health_boards
SET boroughs = '{"boroughs":["Belfast"],"neighbourhoods":["East Belfast","West Belfast","North Belfast","South Belfast","Castlereagh","Dundonald","Newtownbreda","Finaghy","Andersonstown","Falls","Shankill","Stranmillis","Ormeau","Malone","Lisburn Road","Botanic"]}'
WHERE id = 'N09000003';

UPDATE health_boards
SET boroughs = '{"boroughs":["Antrim","Ballymena","Coleraine","Magherafelt","Cookstown","Larne","Moyle","Ballymoney"],"neighbourhoods":["Carrickfergus","Newtownabbey","Glengormley","Randalstown","Toomebridge","Ballycastle","Cushendall","Portrush","Portstewart","Limavady","Dungiven","Maghera"]}'
WHERE id = 'N09000004';

UPDATE health_boards
SET boroughs = '{"boroughs":["Ards","Down","North Down"],"neighbourhoods":["Bangor","Holywood","Newtownards","Comber","Donaghadee","Ballynahinch","Downpatrick","Newcastle","Kilkeel","Dromore","Hillsborough","Lisburn","Carryduff","Saintfield"]}'
WHERE id = 'N09000005';

UPDATE health_boards
SET boroughs = '{"boroughs":["Armagh","Banbridge","Craigavon","Dungannon","Newry and Mourne"],"neighbourhoods":["Portadown","Lurgan","Newry","Warrenpoint","Kilkeel","Bessbrook","Crossmaglen","Keady","Markethill","Tandragee","Gilford","Rathfriland","Dromore","Coalisland","Dungannon","Moy","Caledon","Fivemiletown"]}'
WHERE id = 'N09000006';

UPDATE health_boards
SET boroughs = '{"boroughs":["Derry","Fermanagh","Limavady","Omagh","Strabane"],"neighbourhoods":["Londonderry","Enniskillen","Lisnaskea","Irvinestown","Omagh","Strabane","Castlederg","Newtownstewart","Sion Mills","Claudy","Dungiven","Eglinton","Muff"]}'
WHERE id = 'N09000007';
