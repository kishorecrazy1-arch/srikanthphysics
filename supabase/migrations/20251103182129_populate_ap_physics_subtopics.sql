/*
  # Populate AP Physics Subtopics

  1. Inserts
    - Adds all subtopics for 8 AP Physics units
    - Each subtopic is linked to its parent topic
    - Display order maintains the sequence within each unit

  2. Units Covered
    - Unit 1: Kinematics (5 subtopics)
    - Unit 2: Force and Translational Dynamics (9 subtopics)
    - Unit 3: Work, Energy, and Power (5 subtopics)
    - Unit 4: Linear Momentum (4 subtopics)
    - Unit 5: Torque and Rotational Dynamics (6 subtopics)
    - Unit 6: Energy and Momentum of Rotating Systems (6 subtopics)
    - Unit 7: Oscillations (4 subtopics)
    - Unit 8: Fluids (4 subtopics)
*/

DO $$
DECLARE
  kinematics_id uuid;
  forces_id uuid;
  energy_id uuid;
  momentum_id uuid;
  rotation_id uuid;
  rotating_systems_id uuid;
  oscillations_id uuid;
  fluids_id uuid;
BEGIN
  SELECT id INTO kinematics_id FROM topics WHERE name = 'Kinematics' AND display_order = 1 LIMIT 1;
  SELECT id INTO forces_id FROM topics WHERE name LIKE '%Force%' OR name LIKE '%Newton%' AND display_order = 2 LIMIT 1;
  SELECT id INTO energy_id FROM topics WHERE name LIKE '%Energy%' OR name LIKE '%Work%' AND display_order = 3 LIMIT 1;
  SELECT id INTO momentum_id FROM topics WHERE name LIKE '%Momentum%' AND display_order = 4 LIMIT 1;
  SELECT id INTO rotation_id FROM topics WHERE name LIKE '%Rotation%' OR name LIKE '%Torque%' AND display_order = 6 LIMIT 1;
  SELECT id INTO oscillations_id FROM topics WHERE name LIKE '%Oscillation%' OR name LIKE '%Wave%' AND display_order = 7 LIMIT 1;

  IF kinematics_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (kinematics_id, 'Scalars and Vectors in One Dimension', 'Understanding scalar and vector quantities in one-dimensional motion', 1),
      (kinematics_id, 'Displacement, Velocity, and Acceleration', 'Key kinematic variables and their relationships', 2),
      (kinematics_id, 'Representing Motion', 'Graphs and equations to represent motion', 3),
      (kinematics_id, 'Reference Frames and Relative Motion', 'Understanding motion from different perspectives', 4),
      (kinematics_id, 'Vectors and Motion in Two Dimensions', 'Projectile motion and 2D vector analysis', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  IF forces_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (forces_id, 'Systems and Center of Mass', 'Understanding systems of particles and center of mass', 1),
      (forces_id, 'Forces and Free-Body Diagrams', 'Identifying forces and drawing free-body diagrams', 2),
      (forces_id, 'Newton''s Third Law', 'Action-reaction pairs and their applications', 3),
      (forces_id, 'Newton''s First Law', 'Inertia and equilibrium', 4),
      (forces_id, 'Newton''s Second Law', 'Force, mass, and acceleration relationships', 5),
      (forces_id, 'Gravitational Force', 'Universal gravitation and weight', 6),
      (forces_id, 'Kinetic and Static Friction', 'Friction forces and their effects', 7),
      (forces_id, 'Spring Forces', 'Hooke''s Law and elastic forces', 8),
      (forces_id, 'Circular Motion', 'Centripetal force and circular dynamics', 9)
    ON CONFLICT DO NOTHING;
  END IF;

  IF energy_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (energy_id, 'Translational Kinetic Energy', 'Energy of motion in translation', 1),
      (energy_id, 'Work', 'Work done by forces and work-energy theorem', 2),
      (energy_id, 'Potential Energy', 'Gravitational and elastic potential energy', 3),
      (energy_id, 'Conservation of Energy', 'Energy conservation in closed systems', 4),
      (energy_id, 'Power', 'Rate of energy transfer and work', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  IF momentum_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (momentum_id, 'Linear Momentum', 'Momentum and its relation to force', 1),
      (momentum_id, 'Change in Momentum and Impulse', 'Impulse-momentum theorem', 2),
      (momentum_id, 'Conservation of Linear Momentum', 'Momentum conservation in collisions', 3),
      (momentum_id, 'Elastic and Inelastic Collisions', 'Types of collisions and energy conservation', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  IF rotation_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (rotation_id, 'Rotational Kinematics', 'Angular displacement, velocity, and acceleration', 1),
      (rotation_id, 'Connecting Linear and Rotational Motion', 'Relationships between linear and angular quantities', 2),
      (rotation_id, 'Torque', 'Rotational force and moment arm', 3),
      (rotation_id, 'Rotational Inertia', 'Moment of inertia and its calculation', 4),
      (rotation_id, 'Rotational Equilibrium and Newton''s First Law in Rotational Form', 'Static equilibrium for rotating objects', 5),
      (rotation_id, 'Newton''s Second Law in Rotational Form', 'Torque and angular acceleration', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO rotating_systems_id FROM topics WHERE name LIKE '%Rotation%' AND display_order >= 6 LIMIT 1 OFFSET 1;
  IF rotating_systems_id IS NULL THEN
    rotating_systems_id := rotation_id;
  END IF;

  IF rotating_systems_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (rotating_systems_id, 'Rotational Kinetic Energy', 'Energy of rotating objects', 7),
      (rotating_systems_id, 'Torque and Work', 'Work done by torque', 8),
      (rotating_systems_id, 'Angular Momentum and Angular Impulse', 'Angular momentum and its change', 9),
      (rotating_systems_id, 'Conservation of Angular Momentum', 'Angular momentum conservation', 10),
      (rotating_systems_id, 'Rolling', 'Combined translational and rotational motion', 11),
      (rotating_systems_id, 'Motion of Orbiting Satellites', 'Orbital mechanics and satellite motion', 12)
    ON CONFLICT DO NOTHING;
  END IF;

  IF oscillations_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (oscillations_id, 'Defining Simple Harmonic Motion (SHM)', 'Characteristics of SHM', 1),
      (oscillations_id, 'Frequency and Period of SHM', 'Time-related properties of oscillations', 2),
      (oscillations_id, 'Representing and Analyzing SHM', 'Mathematical and graphical representations', 3),
      (oscillations_id, 'Energy of Simple Harmonic Oscillators', 'Energy transformations in SHM', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO fluids_id FROM topics WHERE name LIKE '%Fluid%' LIMIT 1;
  IF fluids_id IS NULL THEN
    SELECT id INTO fluids_id FROM topics ORDER BY display_order DESC LIMIT 1;
  END IF;

  IF fluids_id IS NOT NULL AND fluids_id != oscillations_id THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (fluids_id, 'Internal Structure and Density', 'Matter structure and density calculations', 1),
      (fluids_id, 'Pressure', 'Fluid pressure and its applications', 2),
      (fluids_id, 'Fluids and Newton''s Laws', 'Forces in fluids', 3),
      (fluids_id, 'Fluids and Conservation Laws', 'Bernoulli''s equation and continuity', 4)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
