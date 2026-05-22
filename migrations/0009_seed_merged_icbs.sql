-- Seed merged ICB metadata: set data_confidence and predecessor_icb for the 6 parent ICBs
-- formed in the April 2026 NHS England mergers.

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'North West London ICB, North Central London ICB'
WHERE id = 'Z9B2Z';

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'Hertfordshire & West Essex ICB, Bedfordshire Luton & Milton Keynes ICB, Cambridgeshire & Peterborough ICB'
WHERE id = 'S1Y5D';

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'Mid & South Essex ICB, Suffolk & North East Essex ICB (partial)'
WHERE id = 'D7T5G';

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'Norfolk & Waveney ICB, Suffolk & North East Essex ICB (partial)'
WHERE id = 'T6Y0W';

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'Surrey Heartlands ICB, Sussex ICB'
WHERE id = 'S9B9J';

UPDATE health_boards
SET data_confidence = 'inherited',
    predecessor_icb = 'Buckinghamshire Oxfordshire & Berkshire West ICB, Frimley ICB (partial)'
WHERE id = 'S0E4D';
