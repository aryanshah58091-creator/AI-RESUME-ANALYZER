-- Create Jobs Table for Job Matching System
-- This table stores all job postings from companies

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `job_title` varchar(255) NOT NULL,
  `job_description` text NOT NULL,
  `required_skills` text NOT NULL,
  `experience_required` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `job_type` enum('Full-time','Part-time','Contract','Internship') DEFAULT 'Full-time',
  `salary_range` varchar(100) DEFAULT NULL,
  `posted_by` int(11) DEFAULT NULL,
  `status` enum('active','closed','draft') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `posted_by` (`posted_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create Job Applications Table
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `resume_id` int(11) NOT NULL,
  `match_score` int(11) DEFAULT NULL,
  `status` enum('pending','reviewed','shortlisted','rejected','accepted') DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `user_id` (`user_id`),
  KEY `resume_id` (`resume_id`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `job_applications_ibfk_3` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert Sample Jobs
INSERT INTO `jobs` (`company_name`, `job_title`, `job_description`, `required_skills`, `experience_required`, `location`, `job_type`, `salary_range`, `status`) VALUES
('Google', 'Software Engineer', 'We are looking for a talented Software Engineer to join our team. You will work on cutting-edge technologies and build scalable applications.', 'JavaScript, React, Node.js, Python, SQL, Git', '2-4 years', 'Bangalore, India', 'Full-time', '₹15-25 LPA', 'active'),
('Microsoft', 'Full Stack Developer', 'Join Microsoft as a Full Stack Developer. Work on cloud-based solutions and enterprise applications.', 'C#, .NET, Azure, JavaScript, Angular, SQL Server', '3-5 years', 'Hyderabad, India', 'Full-time', '₹18-30 LPA', 'active'),
('Amazon', 'Frontend Developer', 'Amazon is hiring Frontend Developers to build amazing user experiences for millions of customers.', 'React, JavaScript, TypeScript, HTML, CSS, Redux', '1-3 years', 'Mumbai, India', 'Full-time', '₹12-20 LPA', 'active'),
('Infosys', 'Java Developer', 'Looking for Java Developers to work on enterprise applications and microservices architecture.', 'Java, Spring Boot, Hibernate, MySQL, REST API, Docker', '2-5 years', 'Pune, India', 'Full-time', '₹8-15 LPA', 'active'),
('TCS', 'Python Developer', 'TCS is hiring Python Developers for AI/ML projects and data analytics solutions.', 'Python, Django, Flask, Machine Learning, SQL, AWS', '1-4 years', 'Chennai, India', 'Full-time', '₹6-12 LPA', 'active'),
('Wipro', 'DevOps Engineer', 'Join Wipro as a DevOps Engineer. Work on CI/CD pipelines and cloud infrastructure.', 'Docker, Kubernetes, Jenkins, AWS, Linux, Git, Python', '2-4 years', 'Bangalore, India', 'Full-time', '₹10-18 LPA', 'active'),
('Accenture', 'Data Analyst', 'Accenture is looking for Data Analysts to work on business intelligence and data visualization projects.', 'SQL, Python, Power BI, Excel, Tableau, Data Analysis', '1-3 years', 'Gurgaon, India', 'Full-time', '₹7-14 LPA', 'active'),
('Cognizant', 'Mobile App Developer', 'Develop mobile applications for iOS and Android platforms using modern frameworks.', 'React Native, Flutter, iOS, Android, JavaScript, Firebase', '2-4 years', 'Kolkata, India', 'Full-time', '₹9-16 LPA', 'active'),
('HCL', 'UI/UX Designer', 'HCL is hiring UI/UX Designers to create beautiful and intuitive user interfaces.', 'Figma, Adobe XD, Sketch, HTML, CSS, User Research', '1-3 years', 'Noida, India', 'Full-time', '₹6-12 LPA', 'active'),
('Tech Mahindra', 'Cloud Engineer', 'Work on cloud migration projects and build scalable cloud infrastructure.', 'AWS, Azure, GCP, Terraform, Docker, Kubernetes, Python', '3-6 years', 'Bangalore, India', 'Full-time', '₹12-22 LPA', 'active'),
('Capgemini', 'Business Analyst', 'Join Capgemini as a Business Analyst. Work with clients to understand requirements and deliver solutions.', 'Business Analysis, SQL, Excel, JIRA, Agile, Communication', '2-5 years', 'Mumbai, India', 'Full-time', '₹8-15 LPA', 'active'),
('IBM', 'AI/ML Engineer', 'IBM is hiring AI/ML Engineers to work on cutting-edge artificial intelligence projects.', 'Python, TensorFlow, PyTorch, Machine Learning, Deep Learning, NLP', '2-4 years', 'Bangalore, India', 'Full-time', '₹15-28 LPA', 'active'),
('Deloitte', 'Cybersecurity Analyst', 'Protect our systems and data as a Cybersecurity Analyst at Deloitte.', 'Network Security, Penetration Testing, SIEM, Firewall, Linux', '2-4 years', 'Delhi, India', 'Full-time', '₹10-18 LPA', 'active'),
('Oracle', 'Database Administrator', 'Manage and optimize Oracle databases for enterprise clients.', 'Oracle, SQL, PL/SQL, Database Tuning, Backup & Recovery', '3-6 years', 'Hyderabad, India', 'Full-time', '₹12-20 LPA', 'active'),
('Flipkart', 'Product Manager', 'Lead product development and strategy for Flipkart''s e-commerce platform.', 'Product Management, Agile, Market Research, SQL, Analytics', '3-5 years', 'Bangalore, India', 'Full-time', '₹20-35 LPA', 'active');
