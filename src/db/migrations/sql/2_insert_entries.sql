-- Insert entries into the recruiter table
INSERT INTO recruiter (id, recName, email, recDept, recStatus) VALUES
    (uuid_generate_v4(), 'John Doe', 'john.doe@example.com', 'HR', 'Active'),
    (uuid_generate_v4(), 'Jane Smith', 'jane.smith@example.com', 'Engineering', 'Active'),
    (uuid_generate_v4(), 'Alice Johnson', 'alice.johnson@example.com', 'Marketing', 'Inactive');

-- Insert entries into the candidate table
INSERT INTO candidate (id, userName, userDept, age, email, userStatus) VALUES
    (uuid_generate_v4(), 'Bob Brown', 'Engineering', 30, 'bob.brown@example.com', 'Active'),
    (uuid_generate_v4(), 'Carol White', 'HR', 28, 'carol.white@example.com', 'Inactive'),
    (uuid_generate_v4(), 'Dave Black', 'Marketing', 35, 'dave.black@example.com', 'Active');

-- Insert entries into the jobListings table
INSERT INTO jobListings (id, recId, dept, jobDesc, salaryRange) VALUES
    (uuid_generate_v4(), (SELECT id FROM recruiter WHERE recName='John Doe'), 'Engineering', 'Software Engineer', '60-80k'),
    (uuid_generate_v4(), (SELECT id FROM recruiter WHERE recName='Jane Smith'), 'Marketing', 'Marketing Specialist', '50-70k'),
    (uuid_generate_v4(), (SELECT id FROM recruiter WHERE recName='Alice Johnson'), 'HR', 'HR Manager', '70-90k');

-- Insert entries into the jobApplications table
INSERT INTO jobApplications (id, jobId, recruiterId, candidateId) VALUES
    (uuid_generate_v4(), 
        (SELECT id FROM jobListings WHERE jobDesc='Software Engineer'), 
        (SELECT id FROM recruiter WHERE recName='John Doe'), 
        (SELECT id FROM candidate WHERE userName='Bob Brown')),
    (uuid_generate_v4(), 
        (SELECT id FROM jobListings WHERE jobDesc='Marketing Specialist'), 
        (SELECT id FROM recruiter WHERE recName='Jane Smith'), 
        (SELECT id FROM candidate WHERE userName='Carol White')),
    (uuid_generate_v4(), 
        (SELECT id FROM jobListings WHERE jobDesc='HR Manager'), 
        (SELECT id FROM recruiter WHERE recName='Alice Johnson'), 
        (SELECT id FROM candidate WHERE userName='Dave Black')
    );
