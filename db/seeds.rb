# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
if RUBY_VERSION >= "1.9"
  require 'csv'
else
  require 'fastercsv'
  CSV = FasterCSV
end

data = {}
data[:roles] = [
                {:name => "Actor"},
                {:name => "Director"}
               ]
data[:movies] = [
                 {:title => "Matrix", :duration => 130, :first_on=> Date.civil(1999,3,31)},
                 {:title => "Memento", :duration => 116, :first_on=> Date.civil(2000,10,11)},
                 {:title => "Dardevil", :duration => 104, :first_on=> Date.civil(2003,2,9)},
                 {:title => "Public enemies", :duration => 140, :first_on=> Date.civil(2009,7,8)},
                 {:title => "Inception", :duration => 148, :first_on=> Date.civil(2010,7,16)}
                ]
data[:people] = [
                 {:first_name => "Keanu", :last_name => "Reeves", :born_on => Date.civil(1964,9,2), :surname => "The Wall"},
                 {:first_name => "Carrie-Anne", :last_name => "Moss", :born_on => Date.civil(1967,8,21)},
                 {:first_name => "Joe", :last_name => "Pantoliano", :born_on => Date.civil(1951,9,12)},
                 {:first_name => "Guy", :last_name => "Pearce", :born_on => Date.civil(1967,10,5)},
                 {:first_name => "Christian", :last_name => "Bale", :born_on => Date.civil(1974,1,30)},
                 {:first_name => "Christopher", :last_name => "Nolan", :born_on => Date.civil(1970,7,30)},
                 {:first_name => "Ben", :last_name => "Affleck", :born_on => Date.civil(1972,8,15)},
                 {:first_name => "Marion", :last_name => "Cotillard", :born_on => Date.civil(1975,9,30)}
                ]

collaborations = [
                  [0, 0, 0],
                  [0, 0, 1],
                  [0, 0, 2],
                  [0, 1, 1],
                  [0, 1, 2],
                  [0, 1, 3],
                  [1, 1, 5],
                  [0, 2, 2],
                  [0, 2, 6],
                  [0, 3, 4],
                  [0, 3, 7],
                  [1, 4, 5],
                  [0, 4, 7]
                 ]
for model, records in data
  klass = model.to_s.classify.constantize
  records.each_index do |i|
    r = klass.create!(records[i])
    records[i][:id] = r.id
  end
end

for collab in collaborations
  Collaboration.create!(:role_id=>data[:roles][collab[0]][:id], :movie_id=>data[:movies][collab[1]][:id], :person_id=>data[:people][collab[2]][:id])
end


# More people
CSV.foreach(Rails.root.join('db', "actors.csv")) do |row|
  Person.create!(:first_name=>row[0], :last_name=>row[1], :born_on=>row[2].to_date, :default_role_id=>data[:roles][0][:id])
end

