-- Enable the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the tables with UUID primary keys
CREATE TABLE IF NOT EXISTS recruiter 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    recDept VARCHAR(50) NOT NULL,
    recStatus VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userName VARCHAR(50) NOT NULL,
    userDept VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(50) NOT NULL,
    userStatus VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS jobListings
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recId UUID NOT NULL,
    dept VARCHAR(50) NOT NULL,
    jobDesc VARCHAR(50) NOT NULL,
    salaryRange VARCHAR(30) NOT NULL,
    FOREIGN KEY (recId) REFERENCES recruiter(id)
);

CREATE TABLE IF NOT EXISTS jobApplications 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jobId UUID NOT NULL,
    recruiterId UUID NOT NULL,
    candidateId UUID NOT NULL, 
    FOREIGN KEY (jobId) REFERENCES jobListings(id),
    FOREIGN KEY (recruiterId) REFERENCES recruiter(id),
    FOREIGN KEY (candidateId) REFERENCES candidate(id)
);
