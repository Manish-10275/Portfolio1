/*
  # Insert initial data for education and experience

  This migration adds the initial data for:
  1. Education timeline
  2. Experience entries
  3. Skills categories
*/

-- Insert education data
INSERT INTO education (year, title, description) VALUES
  ('2013-2018', 'Primary Education', 'Completed primary education with excellence'),
  ('2018-2022', 'Secondary Education', 'Completed 10th grade with outstanding performance'),
  ('2022-2024', 'Higher Secondary', 'Currently pursuing at Swami Vivekanand Govt. Model School, awaiting results');

-- Insert experience data
INSERT INTO experience (title, description, icon) VALUES
  ('Self-Taught Programming', 'Gained expertise in Python, Java, C++, C, and HTML through self-learning using free online platforms like YouTube and other open resources.', 'code'),
  ('App Development', 'Developed a plant disease recognition app using Python, showcasing practical application of technical skills in agriculture technology.', 'layout'),
  ('Published Author', 'Published two books, ''Chalo Aaj Kuch Dil Ki Baat Ho Jaye'' and ''The SILENCE,'' featuring shayaris and poetry on themes of overthinking and heartbreak.', 'book'),
  ('Creative Design', 'Created impactful advertising and branding materials, including logo designs and ad campaigns, through freelance projects.', 'pencil'),
  ('Project Leadership', 'Led and managed teams for innovative school projects and competitions, including the ATAL Marathon, ensuring successful completion of complex tasks.', 'users'),
  ('Self-Development', 'Utilized research skills and self-discipline to acquire in-depth knowledge across diverse fields, showcasing adaptability and commitment to growth.', 'brain');

-- Insert skills data
INSERT INTO skills (category, name) VALUES
  ('Creative Skills', 'Singing and Music Creation'),
  ('Creative Skills', 'Songwriting in Hindi and English'),
  ('Creative Skills', 'Sher and Poetry Writing'),
  ('Creative Skills', 'Book Writing and Publishing'),
  ('Programming Skills', 'Python'),
  ('Programming Skills', 'Java'),
  ('Programming Skills', 'C++'),
  ('Programming Skills', 'C'),
  ('Programming Skills', 'HTML'),
  ('Programming Skills', 'SQL'),
  ('Programming Skills', 'App Development'),
  ('Technical Skills', 'Ad Design'),
  ('Technical Skills', 'Logo Design'),
  ('Technical Skills', 'Copywriting'),
  ('Technical Skills', 'Social Media Marketing'),
  ('Technical Skills', 'Research Skills'),
  ('Leadership and Innovation', 'Team Management'),
  ('Leadership and Innovation', 'Creative Problem-Solving'),
  ('Leadership and Innovation', 'Startup Involvement'),
  ('Leadership and Innovation', 'Project Management'),
  ('Other Skills', 'Public Speaking and Presentation'),
  ('Other Skills', 'Content Creation'),
  ('Other Skills', 'Event Organization'),
  ('Other Skills', 'Multilingual Writing');