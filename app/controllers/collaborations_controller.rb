class CollaborationsController < ApplicationController
  formize do |f|

    f.field_set do |fs|
      fs.field :person, :choices=>:all, :new=>true
      fs.field :movie, :choices=>:all, :new=>true
      fs.field :role, :choices=>:all, :new=>true, :depend_on=>:person, :default=>"person.default_role"
      fs.group :depend_on=>:movie do |g|
        g.field :started_on, :default=>"movie.first_on - 1.year"
        g.field :stopped_on, :default=>"movie.first_on"
      end
      fs.field :note
    end

  end


  # GET /collaborations
  # GET /collaborations.xml
  def index
    @collaborations = Collaboration.includes(:role, :person, :movie)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @collaborations }
    end
  end

  # GET /collaborations/1
  # GET /collaborations/1.xml
  def show
    @collaboration = Collaboration.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @collaboration }
    end
  end

  # GET /collaborations/new
  # GET /collaborations/new.xml
  def new
    @collaboration = Collaboration.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @collaboration }
    end
  end

  # GET /collaborations/1/edit
  def edit
    @collaboration = Collaboration.find(params[:id])
  end

  # POST /collaborations
  # POST /collaborations.xml
  def create
    @collaboration = Collaboration.new(params[:collaboration])
    save_and_respond(@collaboration)
  end

  # PUT /collaborations/1
  # PUT /collaborations/1.xml
  def update
    @collaboration = Collaboration.find(params[:id])
    save_and_respond(@collaboration, :attributes=>params[:collaboration])
  end

  # DELETE /collaborations/1
  # DELETE /collaborations/1.xml
  def destroy
    @collaboration = Collaboration.find(params[:id])
    @collaboration.destroy

    respond_to do |format|
      format.html { redirect_to(collaborations_url) }
      format.xml  { head :ok }
    end
  end
end
