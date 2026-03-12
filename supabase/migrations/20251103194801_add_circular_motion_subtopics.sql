/*
  # Add Subtopics for Circular Motion & Gravitation

  1. New Subtopics
    - Adds 6 subtopics for "Circular Motion & Gravitation" topic:
      - Uniform Circular Motion
      - Centripetal Force and Acceleration
      - Universal Gravitation
      - Orbital Motion
      - Gravitational Potential Energy
      - Satellites and Kepler's Laws

  2. Changes
    - Inserts subtopics into the subtopics table with proper display order
    - Each subtopic includes name and description

  3. Security
    - No RLS changes needed (already configured)
*/

-- Add subtopics for Circular Motion & Gravitation
INSERT INTO subtopics (topic_id, name, description, display_order)
VALUES 
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Uniform Circular Motion', 'Motion in a circle at constant speed', 1),
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Centripetal Force and Acceleration', 'Forces causing circular motion', 2),
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Universal Gravitation', 'Newton''s Law of Universal Gravitation', 3),
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Orbital Motion', 'Planets, moons, and orbital mechanics', 4),
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Gravitational Potential Energy', 'Energy in gravitational fields', 5),
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'Satellites and Kepler''s Laws', 'Satellite motion and Kepler''s three laws', 6)
ON CONFLICT DO NOTHING;
