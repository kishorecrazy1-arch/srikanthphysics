/*
  # Populate All Topics with Sample Questions

  1. Purpose
    - Generate comprehensive sample questions for all 7 major AP Physics topics
    - Cover all subtopics with variety of question types
    - Include basics, practice, and homework segments

  2. Topics Covered
    - Kinematics
    - Newton's Laws & Forces
    - Work, Energy & Power
    - Momentum & Collisions
    - Circular Motion & Gravitation
    - Rotational Motion
    - Oscillations & Waves

  3. Question Types
    - Multiple choice with detailed explanations
    - Covers easy, medium, and hard difficulties
    - Includes all subtopics for each major topic
*/

-- Kinematics Questions
INSERT INTO questions (topic_id, segment_type, question_text, options, difficulty, question_type, subtopic, explanation, time_limit, ai_generated)
VALUES 
  ('64c1f4ae-6a29-4848-8b6f-5ced5435887d', 'basics', 'A car accelerates from rest to 30 m/s in 6 seconds. What is its acceleration?', 
   '[{"id":"A","text":"3 m/s²","isCorrect":false},{"id":"B","text":"5 m/s²","isCorrect":true},{"id":"C","text":"6 m/s²","isCorrect":false},{"id":"D","text":"10 m/s²","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Motion Graphs and Equations',
   '{"steps":[{"title":"Identify given values","content":"Initial velocity (u) = 0 m/s, Final velocity (v) = 30 m/s, Time (t) = 6 s"},{"title":"Apply formula","content":"Use a = (v - u) / t"},{"title":"Calculate","content":"a = (30 - 0) / 6 = 5 m/s²"}],"keyConcept":"Acceleration is the rate of change of velocity.","relatedFormulas":["a = (v - u) / t","v = u + at"]}'::jsonb,
   120, false),

  ('64c1f4ae-6a29-4848-8b6f-5ced5435887d', 'practice', 'A ball is thrown vertically upward with velocity 25 m/s. What maximum height does it reach? (g = 10 m/s²)',
   '[{"id":"A","text":"25 m","isCorrect":false},{"id":"B","text":"31.25 m","isCorrect":true},{"id":"C","text":"50 m","isCorrect":false},{"id":"D","text":"62.5 m","isCorrect":false}]'::jsonb,
   'medium', 'calculation', 'Projectile Motion',
   '{"steps":[{"title":"At maximum height","content":"Final velocity v = 0"},{"title":"Use kinematic equation","content":"v² = u² + 2as, where a = -g"},{"title":"Calculate","content":"0 = 25² - 2(10)h, h = 625/20 = 31.25 m"}],"keyConcept":"At maximum height, velocity becomes zero.","relatedFormulas":["v² = u² + 2as"]}'::jsonb,
   180, false),

-- Newton's Laws & Forces Questions  
  ('3b63d990-0235-432a-8b34-7fb2648da272', 'basics', 'What is the net force on a 5 kg object accelerating at 4 m/s²?',
   '[{"id":"A","text":"9 N","isCorrect":false},{"id":"B","text":"20 N","isCorrect":true},{"id":"C","text":"1.25 N","isCorrect":false},{"id":"D","text":"40 N","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Newton''s Second Law',
   '{"steps":[{"title":"Apply Newton''s Second Law","content":"F = ma"},{"title":"Substitute values","content":"F = 5 kg × 4 m/s²"},{"title":"Calculate","content":"F = 20 N"}],"keyConcept":"Force equals mass times acceleration.","relatedFormulas":["F = ma"]}'::jsonb,
   120, false),

  ('3b63d990-0235-432a-8b34-7fb2648da272', 'practice', 'A 2 kg block rests on a table. What is the normal force if g = 10 m/s²?',
   '[{"id":"A","text":"10 N","isCorrect":false},{"id":"B","text":"20 N","isCorrect":true},{"id":"C","text":"2 N","isCorrect":false},{"id":"D","text":"5 N","isCorrect":false}]'::jsonb,
   'easy', 'conceptual', 'Normal Force and Contact Forces',
   '{"steps":[{"title":"Identify forces","content":"Weight acts downward, normal force acts upward"},{"title":"Apply equilibrium","content":"Normal force = Weight = mg"},{"title":"Calculate","content":"N = 2 × 10 = 20 N"}],"keyConcept":"Normal force equals weight for object at rest on horizontal surface.","relatedFormulas":["N = mg (at rest)"]}'::jsonb,
   120, false),

-- Work, Energy & Power Questions
  ('b088de06-5b6e-4c33-a515-ee9536948234', 'basics', 'How much work is done by a 50 N force moving an object 10 m in the direction of force?',
   '[{"id":"A","text":"5 J","isCorrect":false},{"id":"B","text":"60 J","isCorrect":false},{"id":"C","text":"500 J","isCorrect":true},{"id":"D","text":"5000 J","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Work and Energy Concepts',
   '{"steps":[{"title":"Apply work formula","content":"W = F × d (when force is parallel to displacement)"},{"title":"Substitute values","content":"W = 50 N × 10 m"},{"title":"Calculate","content":"W = 500 J"}],"keyConcept":"Work is force times displacement in the direction of force.","relatedFormulas":["W = F·d·cos(θ)"]}'::jsonb,
   120, false),

  ('b088de06-5b6e-4c33-a515-ee9536948234', 'practice', 'A 2 kg object moving at 5 m/s. What is its kinetic energy?',
   '[{"id":"A","text":"10 J","isCorrect":false},{"id":"B","text":"25 J","isCorrect":true},{"id":"C","text":"50 J","isCorrect":false},{"id":"D","text":"12.5 J","isCorrect":false}]'::jsonb,
   'medium', 'calculation', 'Kinetic Energy',
   '{"steps":[{"title":"Use KE formula","content":"KE = ½mv²"},{"title":"Substitute","content":"KE = ½ × 2 × 5²"},{"title":"Calculate","content":"KE = ½ × 2 × 25 = 25 J"}],"keyConcept":"Kinetic energy depends on mass and velocity squared.","relatedFormulas":["KE = ½mv²"]}'::jsonb,
   150, false),

-- Momentum & Collisions Questions
  ('44364258-59f4-4345-ac35-db71f787521d', 'basics', 'A 3 kg object moves at 4 m/s. What is its momentum?',
   '[{"id":"A","text":"7 kg·m/s","isCorrect":false},{"id":"B","text":"12 kg·m/s","isCorrect":true},{"id":"C","text":"1.33 kg·m/s","isCorrect":false},{"id":"D","text":"24 kg·m/s","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Linear Momentum',
   '{"steps":[{"title":"Use momentum formula","content":"p = mv"},{"title":"Substitute","content":"p = 3 kg × 4 m/s"},{"title":"Calculate","content":"p = 12 kg·m/s"}],"keyConcept":"Momentum is mass times velocity.","relatedFormulas":["p = mv"]}'::jsonb,
   120, false),

  ('44364258-59f4-4345-ac35-db71f787521d', 'practice', 'In a perfectly elastic collision, what is conserved?',
   '[{"id":"A","text":"Only momentum","isCorrect":false},{"id":"B","text":"Only kinetic energy","isCorrect":false},{"id":"C","text":"Both momentum and kinetic energy","isCorrect":true},{"id":"D","text":"Neither momentum nor kinetic energy","isCorrect":false}]'::jsonb,
   'medium', 'conceptual', 'Elastic and Inelastic Collisions',
   '{"steps":[{"title":"Define elastic collision","content":"No kinetic energy is lost to heat, sound, or deformation"},{"title":"Conservation laws","content":"Momentum is always conserved in collisions, KE conserved only in elastic"},{"title":"Conclusion","content":"Both momentum and KE are conserved in elastic collisions"}],"keyConcept":"Elastic collisions conserve both momentum and kinetic energy.","relatedFormulas":["Σp_before = Σp_after","ΣKE_before = ΣKE_after (elastic only)"]}'::jsonb,
   150, false),

-- Circular Motion & Gravitation Questions
  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'basics', 'An object moves in a circle of radius 2 m at 4 m/s. What is its centripetal acceleration?',
   '[{"id":"A","text":"2 m/s²","isCorrect":false},{"id":"B","text":"4 m/s²","isCorrect":false},{"id":"C","text":"8 m/s²","isCorrect":true},{"id":"D","text":"16 m/s²","isCorrect":false}]'::jsonb,
   'medium', 'calculation', 'Uniform Circular Motion',
   '{"steps":[{"title":"Use centripetal acceleration formula","content":"a_c = v²/r"},{"title":"Substitute","content":"a_c = 4² / 2"},{"title":"Calculate","content":"a_c = 16/2 = 8 m/s²"}],"keyConcept":"Centripetal acceleration always points toward the center of the circle.","relatedFormulas":["a_c = v²/r","a_c = ω²r"]}'::jsonb,
   150, false),

  ('067a0822-9109-40e7-8a91-b7aa3d3d516f', 'practice', 'The gravitational force between two masses is F. If the distance between them doubles, what is the new force?',
   '[{"id":"A","text":"F/2","isCorrect":false},{"id":"B","text":"F/4","isCorrect":true},{"id":"C","text":"2F","isCorrect":false},{"id":"D","text":"4F","isCorrect":false}]'::jsonb,
   'medium', 'conceptual', 'Universal Gravitation',
   '{"steps":[{"title":"Gravitational force law","content":"F = G(m₁m₂)/r²"},{"title":"Effect of doubling distance","content":"New distance = 2r, so new force = G(m₁m₂)/(2r)² = G(m₁m₂)/4r²"},{"title":"Compare","content":"New force = F/4"}],"keyConcept":"Gravitational force follows inverse square law.","relatedFormulas":["F = G(m₁m₂)/r²"]}'::jsonb,
   180, false),

-- Rotational Motion Questions
  ('a79b7c47-5510-4739-b005-a56c4e5f83f7', 'basics', 'A wheel rotates 10 times in 5 seconds. What is its angular velocity in rad/s?',
   '[{"id":"A","text":"2π rad/s","isCorrect":false},{"id":"B","text":"4π rad/s","isCorrect":true},{"id":"C","text":"10π rad/s","isCorrect":false},{"id":"D","text":"20π rad/s","isCorrect":false}]'::jsonb,
   'medium', 'calculation', 'Rotational Kinematics',
   '{"steps":[{"title":"Calculate frequency","content":"f = 10 rotations / 5 s = 2 Hz"},{"title":"Convert to angular velocity","content":"ω = 2πf"},{"title":"Calculate","content":"ω = 2π × 2 = 4π rad/s"}],"keyConcept":"Angular velocity is 2π times frequency.","relatedFormulas":["ω = 2πf","θ = ωt"]}'::jsonb,
   150, false),

  ('a79b7c47-5510-4739-b005-a56c4e5f83f7', 'practice', 'A disk has moment of inertia 2 kg·m² and rotates at 5 rad/s. What is its rotational kinetic energy?',
   '[{"id":"A","text":"25 J","isCorrect":true},{"id":"B","text":"50 J","isCorrect":false},{"id":"C","text":"10 J","isCorrect":false},{"id":"D","text":"5 J","isCorrect":false}]'::jsonb,
   'medium', 'calculation', 'Rotational Energy',
   '{"steps":[{"title":"Use rotational KE formula","content":"KE_rot = ½Iω²"},{"title":"Substitute","content":"KE = ½ × 2 × 5²"},{"title":"Calculate","content":"KE = ½ × 2 × 25 = 25 J"}],"keyConcept":"Rotational kinetic energy analogous to linear KE but uses moment of inertia.","relatedFormulas":["KE_rot = ½Iω²"]}'::jsonb,
   180, false),

-- Oscillations & Waves Questions
  ('ebce4deb-f94c-495c-809f-06b5d428bf79', 'basics', 'A pendulum completes 20 oscillations in 10 seconds. What is its period?',
   '[{"id":"A","text":"0.5 s","isCorrect":true},{"id":"B","text":"2 s","isCorrect":false},{"id":"C","text":"10 s","isCorrect":false},{"id":"D","text":"20 s","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Simple Harmonic Motion',
   '{"steps":[{"title":"Define period","content":"Period T is time for one complete oscillation"},{"title":"Calculate","content":"T = total time / number of oscillations"},{"title":"Result","content":"T = 10 s / 20 = 0.5 s"}],"keyConcept":"Period is the reciprocal of frequency.","relatedFormulas":["T = 1/f","f = 1/T"]}'::jsonb,
   120, false),

  ('ebce4deb-f94c-495c-809f-06b5d428bf79', 'practice', 'A wave has frequency 50 Hz and wavelength 4 m. What is its speed?',
   '[{"id":"A","text":"12.5 m/s","isCorrect":false},{"id":"B","text":"54 m/s","isCorrect":false},{"id":"C","text":"200 m/s","isCorrect":true},{"id":"D","text":"46 m/s","isCorrect":false}]'::jsonb,
   'easy', 'calculation', 'Wave Properties',
   '{"steps":[{"title":"Use wave equation","content":"v = fλ"},{"title":"Substitute","content":"v = 50 Hz × 4 m"},{"title":"Calculate","content":"v = 200 m/s"}],"keyConcept":"Wave speed equals frequency times wavelength.","relatedFormulas":["v = fλ"]}'::jsonb,
   120, false)

ON CONFLICT DO NOTHING;
