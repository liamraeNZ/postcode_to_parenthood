-- Seed boroughs/areas covered for all health boards (SEO: helps users find their ICB by local area name)
-- Format: { "boroughs": [...], "neighbourhoods": [...] }
-- boroughs = official local authority areas; neighbourhoods = smaller areas for long-tail SEO

-- ============================================================
-- LONDON ICBs (with neighbourhood-level data for SEO)
-- ============================================================

-- NHS North East London ICB (QMF)
-- Wards from: Barking and Dagenham, City of London, Hackney, Havering, Newham, Redbridge, Tower Hamlets, Waltham Forest
UPDATE health_boards
SET boroughs = '{"boroughs":["Barking and Dagenham","City of London","Hackney","Havering","Newham","Redbridge","Tower Hamlets","Waltham Forest"],"neighbourhoods":["Abbey","Alibon","Aldborough","Barking","Barkingside","Beckton","Becontree","Bethnal Green North","Bethnal Green South","Blackwall and Cubitt Town","Boleyn","Bow East","Bow West","Bridge","Bromley-by-Bow","Brooklands","Brownswood","Cann Hall","Canning Town North","Canning Town South","Cathall","Cazenove","Chadwell","Chadwell Heath","Chapel End","Chatham","Chingford Green","Church End","Clayhall","Clementswood","Clissold","Cranbrook","Cranham","Custom House","Dalston","De Beauvoir","East Ham Central","East Ham North","East Ham South","East India and Lansbury","Eastbrook","Eastbury","Elm Park","Emerson Park","Endlebury","Fairlop","Forest","Forest Gate North","Forest Gate South","Fullwell","Gascoigne","Goodmayes","Gooshays","Goresbrook","Green Street East","Green Street West","Grove Green","Hackney Central","Hackney Downs","Hacton","Haggerston","Hainault","Hale End and Highams Park","Harold Wood","Hatch Lane","Havering Park","Heath","Heaton","High Street","Higham Hill","Hoe Street","Hoxton","Hylands","King\u0027s Park","Larkwood","Lea Bridge","Leabridge","Leyton","Leytonstone","Limehouse","Little Ilford","Longbridge","Lordship","Loxford","Manor Park","Markhouse","Mawneys","Mayesbrook","Mayfield","Mile End and Globe Town","Mile End East","Millwall","Monkhams","New River","Newbury","Parsloes","Pettits","Plaistow North","Plaistow South","Queensbridge","Rainham and Wennington","Redbridge","River","Roding","Romford Town","Royal Docks","Seven Kings","Shadwell","Snaresbrook","South Hornchurch","Spitalfields and Banglatown","Springfield","Squirrel\u0027s Heath","St Andrew\u0027s","St Dunstan\u0027s and Stepney Green","St Katharine\u0027s and Wapping","Stoke Newington Central","Stratford and New Town","Thames","Tower Hamlets","Upminster","Valence","Valentines","Valley","Victoria","Village","Wall End","Walthamstow","Wanstead","Weavers","West Ham","Whalebone","Whitechapel","Wick","William Morris","Wood Street"]}'
WHERE id = 'QMF';

-- NHS South East London ICB (QKK)
-- Wards from: Bexley, Bromley, Greenwich, Lambeth, Lewisham, Southwark
UPDATE health_boards
SET boroughs = '{"boroughs":["Bexley","Bromley","Greenwich","Lambeth","Lewisham","Southwark"],"neighbourhoods":["Abbey Wood","Barnehurst","Bellingham","Belvedere","Bickley","Biggin Hill","Bishop\u0027s","Blackfen and Lamorbey","Blackheath","Blackheath Westcombe","Blendon and Penhill","Brampton","Brixton Hill","Brockley","Bromley Common and Keston","Bromley Town","Brunswick Park","Camberwell Green","Cathedrals","Catford South","Charlton","Chaucer","Chelsfield and Pratts Bottom","Chislehurst","Christchurch","Clapham Common","Clapham Town","Clock House","Coldharbour","Coldharbour and New Eltham","College","Colyers","Copers Cope","Cray Meadows","Cray Valley East","Cray Valley West","Crayford","Crofton Park","Crystal Palace","Danson Park","Darwin","Downham","East Dulwich","East Walworth","East Wickham","Eltham North","Eltham South","Eltham West","Erith","Evelyn","Falconwood and Welling","Faraday","Farnborough and Crofton","Ferndale","Forest Hill","Gipsy Hill","Glyndon","Grange","Greenwich West","Grove Park","Hayes and Coney Hall","Herne Hill","Kelsey and Eden Park","Kidbrooke with Hornfair","Knight\u0027s Hill","Ladywell","Larkhall","Lee Green","Lesnes Abbey","Lewisham Central","Livesey","Longlands","Middle Park and Sutcliffe","Mottingham and Chislehurst North","New Cross","Newington","North End","Northumberland Heath","Nunhead","Orpington","Oval","Peckham","Peckham Rye","Peninsula","Penge and Cator","Perry Vale","Petts Wood and Knoll","Plaistow and Sundridge","Plumstead","Prince\u0027s","Riverside","Rotherhithe","Rushey Green","Shooters Hill","Shortlands","South Bermondsey","South Camberwell","St Leonard\u0027s","St Mary\u0027s","St Michael\u0027s","Stockwell","Streatham Hill","Streatham South","Streatham Wells","Surrey Docks","Sydenham","Telegraph Hill","Thamesmead East","Thamesmead Moorings","The Lane","Thornton","Thurlow Park","Tulse Hill","Vassall","Village","West Wickham","Whitefoot","Woolwich Common","Woolwich Riverside"]}'
WHERE id = 'QKK';

-- NHS South West London ICB (QWE)
-- Wards from: Croydon, Kingston upon Thames, Merton, Richmond upon Thames, Sutton, Wandsworth
UPDATE health_boards
SET boroughs = '{"boroughs":["Croydon","Kingston upon Thames","Merton","Richmond upon Thames","Sutton","Wandsworth"],"neighbourhoods":["Abbey","Addiscombe","Alexandra","Ashburton","Balham","Barnes","Barnes Common","Beddington North","Beddington South","Bedford","Belmont","Bensham Manor","Berrylands","Beverley","Broad Green","Canbury","Cannon Hill","Carshalton Central","Carshalton South and Clockhouse","Cheam","Chessington North and Hook","Chessington South","Colliers Wood","Coombe Hill","Coombe Vale","Coulsdon East","Coulsdon West","Cricket Green","Croham","Dundonald","Earlsfield","East Putney","East Sheen","Fairfield","Fieldway","Figge\u0027s Marsh","Fulwell and Hampton Hill","Furzedown","Graveney","Grove","Ham Petersham and Richmond Riverside","Hampton","Hampton North","Hampton Wick","Heathfield","Hillside","Kenley","Kew","Latchmere","Lavender Fields","Longthornton","Lower Morden","Merton Park","Mortlake and Barnes Common","New Addington","Nightingale","Nonsuch","Norbiton","Norbury","North Richmond","Northcote","Old Malden","Pollards Hill","Purley","Queenstown","Ravensbury","Raynes Park","Roehampton","St Helier","St James","St Margarets and North Twickenham","St Mark\u0027s","St Mary\u0027s Park","Sanderstead","Selhurst","Selsdon and Ballards","Shaftesbury","Shirley","South Norwood","South Richmond","South Twickenham","Southfields","Stonecot","Surbiton Hill","Sutton Central","Sutton North","Sutton South","Sutton West","Teddington","Thamesfield","The Wrythe","Thornton Heath","Tolworth and Hook Rise","Tooting","Trinity","Tudor","Twickenham Riverside","Upper Norwood","Village","Waddon","Wallington North","Wallington South","Wandle Valley","Wandsworth Common","West Barnes","West Hill","West Putney","West Thornton","West Twickenham","Whitton","Wimbledon Park","Woodside","Worcester Park"]}'
WHERE id = 'QWE';

-- NHS West and North London ICB (Z9B2Z) — merged April 2026
-- Wards from: Barnet, Brent, Camden, Ealing, Enfield, Hammersmith and Fulham, Haringey, Harrow, Hillingdon, Hounslow, Islington, Kensington and Chelsea, Westminster
UPDATE health_boards
SET boroughs = '{"boroughs":["Barnet","Brent","Camden","Ealing","Enfield","Hammersmith and Fulham","Haringey","Harrow","Hillingdon","Hounslow","Islington","Kensington and Chelsea","Westminster"],"neighbourhoods":["Abbey Road","Abingdon","Acton Central","Addison","Alexandra","Alperton","Askew","Avonmore and Brook Green","Barnhill","Barnsbury","Bayswater","Bedfont","Belmont","Belsize","Bloomsbury","Botwell","Bounds Green","Bowes","Brentford","Brompton","Brondesbury Park","Bruce Grove","Brunel","Brunswick Park","Bryanston and Dorset Square","Bunhill","Burnt Oak","Bush Hill Park","Caledonian","Camden Town with Primrose Hill","Campden","Canons","Canonbury","Cantelowes","Cavendish","Charville","Chase","Childs Hill","Chiswick Homefields","Chiswick Riverside","Church Street","Churchill","Clerkenwell","Cleveland","Cockfosters","Colindale","College Park and Old Oak","Colville","Coppetts","Courtfield","Cranford","Cremorne","Crouch End","Dollis Hill","Dormers Wells","Dudden Hill","Ealing Broadway","Ealing Common","Earl\u0027s Court","East Acton","East Barnet","East Finchley","Eastcote and East Ruislip","Edmonton Green","Edgware","Elthorne","Enfield Highway","Enfield Lock","Fairfield","Feltham North","Feltham West","Finchley Church End","Finsbury Park","Fortis Green","Fortune Green","Frognal and Fitzjohns","Fryent","Fulham Broadway","Fulham Reach","Garden Suburb","Golborne","Golders Green","Gospel Oak","Grange","Greenford Broadway","Greenford Green","Greenhill","Hale","Hammersmith Broadway","Hampstead Town","Hanger Hill","Hanworth","Hanworth Park","Harefield","Harlesden","Harringay","Harrow on the Hill","Harrow Road","Harrow Weald","Haselbury","Hatch End","Haverstock","Headstone North","Headstone South","Heathrow Villages","Heston Central","Heston East","Heston West","High Barnet","Highbury East","Highbury West","Highgate","Highlands","Hillingdon East","Hillrise","Hobbayne","Holloway","Hornsey","Hounslow Central","Hounslow Heath","Hounslow South","Hounslow West","Hyde Park","Ickenham","Isleworth","Jubilee","Junction","Kensal Green","Kensington","Kenton","Kenton East","Kenton West","Kentish Town","Kilburn","King\u0027s Cross","Knightsbridge and Belgravia","Lady Margaret","Lancaster Gate","Little Venice","Lower Edmonton","Maida Vale","Manor","Mapesbury","Marlborough","Marylebone High Street","Mildmay","Mill Hill","Munster","Muswell Hill","Noel Park","Norland","North End","North Greenford","Northfield","Northolt Mandeville","Northolt West End","Northumberland Park","Northwick Park","Northwood","Northwood Hills","Norwood Green","Notting Barns","Oakleigh","Osterley and Spring Grove","Palace Riverside","Palmers Green","Parsons Green and Walham","Pembridge","Perivale","Pinkwell","Pinner","Pinner South","Ponders End","Preston","Queen\u0027s Gate","Queen\u0027s Park","Queensbury","Ravenscourt Park","Rayners Lane","Redcliffe","Regent\u0027s Park","Roxbourne","Roxeth","Royal Hospital","Sands End","Seven Sisters","Shepherd\u0027s Bush Green","South Acton","South Ruislip","Southall Broadway","Southall Green","Southbury","Southfield","Southgate","Southgate Green","St Ann\u0027s","St Charles","St George\u0027s","St James\u0027s","St Mary\u0027s","St Pancras and Somers Town","St Peter\u0027s","Stanley","Stanmore Park","Stroud Green","Sudbury","Swiss Cottage","Syon","Tachbrook","Tokyngton","Tollington","Tottenham Green","Tottenham Hale","Totteridge","Town","Townfield","Turkey Street","Turnham Green","Underhill","Upper Edmonton","Uxbridge North","Uxbridge South","Vincent Square","Walpole","Warwick","Wealdstone","Welsh Harp","Wembley Central","West Drayton","West End","West Finchley","West Green","West Hampstead","West Harrow","West Hendon","West Ruislip","Westbourne","White Hart Lane","Willesden Green","Winchmore Hill","Woodhouse","Woodside","Wormholt and White City","Yeading","Yiewsley"]}'
WHERE id = 'Z9B2Z';

-- NHS North Central London ICB (07P) — sub-ICB of Z9B2Z with own page
-- Wards from: Barnet, Camden, Enfield, Haringey, Islington
UPDATE health_boards
SET boroughs = '{"boroughs":["Barnet","Camden","Enfield","Haringey","Islington"],"neighbourhoods":["Alexandra","Barnsbury","Belsize","Bloomsbury","Bounds Green","Bowes","Bruce Grove","Brunswick Park","Bunhill","Burnt Oak","Bush Hill Park","Caledonian","Camden Town with Primrose Hill","Canonbury","Cantelowes","Chase","Childs Hill","Clerkenwell","Cockfosters","Colindale","Coppetts","Crouch End","East Barnet","East Finchley","Edmonton Green","Enfield Highway","Enfield Lock","Finchley Church End","Finsbury Park","Fortis Green","Fortune Green","Frognal and Fitzjohns","Garden Suburb","Golders Green","Gospel Oak","Grange","Hale","Hampstead Town","Harringay","Haselbury","Haverstock","Hendon","High Barnet","Highbury East","Highbury West","Highgate","Highlands","Hillrise","Holloway","Hornsey","Jubilee","Junction","Kentish Town","Kilburn","King\u0027s Cross","Lower Edmonton","Mildmay","Mill Hill","Muswell Hill","Noel Park","Northumberland Park","Oakleigh","Palmers Green","Ponders End","Regent\u0027s Park","Seven Sisters","Southbury","Southgate","Southgate Green","St Ann\u0027s","St George\u0027s","St Mary\u0027s","St Pancras and Somers Town","St Peter\u0027s","Stroud Green","Swiss Cottage","Tollington","Tottenham Green","Tottenham Hale","Totteridge","Town","Turkey Street","Underhill","Upper Edmonton","West Finchley","West Green","West Hampstead","White Hart Lane","Winchmore Hill","Woodhouse","Woodside"]}'
WHERE id = '07P';

-- NHS North West London ICB (08Y) — sub-ICB of Z9B2Z with own page
-- Wards from: Brent, Ealing, Hammersmith and Fulham, Harrow, Hillingdon, Hounslow, Kensington and Chelsea, Westminster
UPDATE health_boards
SET boroughs = '{"boroughs":["Brent","Ealing","Hammersmith and Fulham","Harrow","Hillingdon","Hounslow","Kensington and Chelsea","Westminster"],"neighbourhoods":["Abbey Road","Abingdon","Acton Central","Addison","Alperton","Askew","Avonmore and Brook Green","Barnhill","Bayswater","Bedfont","Belmont","Botwell","Brentford","Brompton","Brondesbury Park","Brunel","Bryanston and Dorset Square","Campden","Canons","Cavendish","Charville","Chiswick Homefields","Chiswick Riverside","Church Street","Churchill","Cleveland","College Park and Old Oak","Colville","Courtfield","Cranford","Cremorne","Dollis Hill","Dormers Wells","Dudden Hill","Ealing Broadway","Ealing Common","Earl\u0027s Court","East Acton","Eastcote and East Ruislip","Edgware","Elthorne","Fairfield","Feltham North","Feltham West","Fryent","Fulham Broadway","Fulham Reach","Golborne","Greenford Broadway","Greenford Green","Greenhill","Hammersmith Broadway","Hanger Hill","Hans Town","Hanworth","Hanworth Park","Harefield","Harlesden","Harrow on the Hill","Harrow Road","Harrow Weald","Hatch End","Headstone North","Headstone South","Heathrow Villages","Heston Central","Heston East","Heston West","Hillingdon East","Hobbayne","Holland","Hounslow Central","Hounslow Heath","Hounslow South","Hounslow West","Hyde Park","Ickenham","Isleworth","Kensal Green","Kenton","Kenton East","Kenton West","Kilburn","Knightsbridge and Belgravia","Lady Margaret","Lancaster Gate","Little Venice","Maida Vale","Manor","Mapesbury","Marlborough","Marylebone High Street","Munster","Norland","North End","North Greenford","Northfield","Northolt Mandeville","Northolt West End","Northwick Park","Northwood","Northwood Hills","Norwood Green","Notting Barns","Osterley and Spring Grove","Palace Riverside","Parsons Green and Walham","Pembridge","Perivale","Pinkwell","Pinner","Pinner South","Preston","Queen\u0027s Gate","Queen\u0027s Park","Queensbury","Ravenscourt Park","Rayners Lane","Redcliffe","Roxbourne","Roxeth","Royal Hospital","Sands End","Shepherd\u0027s Bush Green","South Acton","South Ruislip","Southall Broadway","Southall Green","Southfield","St Charles","St James\u0027s","Stanley","Stanmore Park","Stonebridge","Sudbury","Syon","Tachbrook","Tokyngton","Townfield","Turnham Green","Uxbridge North","Uxbridge South","Vincent Square","Walpole","Warwick","Wealdstone","Welsh Harp","Wembley Central","West Drayton","West End","West Harrow","West Ruislip","Westbourne","Willesden Green","Wormholt and White City","Yeading","Yiewsley"]}'
WHERE id = '08Y';

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
