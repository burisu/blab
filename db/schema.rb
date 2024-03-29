# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110901131408) do

  create_table "collaborations", :force => true do |t|
    t.integer  "role_id"
    t.integer  "movie_id"
    t.integer  "person_id"
    t.date     "started_on"
    t.date     "stopped_on"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "movies", :force => true do |t|
    t.string   "title"
    t.integer  "duration"
    t.date     "first_on"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "awarded"
    t.boolean  "several_times_awarded"
    t.integer  "awards_count"
  end

  create_table "people", :force => true do |t|
    t.string   "type"
    t.string   "last_name"
    t.string   "first_name"
    t.string   "surname"
    t.date     "born_on"
    t.date     "dead_on"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "default_role_id"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
