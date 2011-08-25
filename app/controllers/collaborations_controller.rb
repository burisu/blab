class CollaborationsController < ApplicationController
  # GET /collaborations
  # GET /collaborations.xml
  def index
    @collaborations = Collaboration.all

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

    respond_to do |format|
      if @collaboration.save
        format.html { redirect_to(@collaboration, :notice => 'Collaboration was successfully created.') }
        format.xml  { render :xml => @collaboration, :status => :created, :location => @collaboration }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @collaboration.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /collaborations/1
  # PUT /collaborations/1.xml
  def update
    @collaboration = Collaboration.find(params[:id])

    respond_to do |format|
      if @collaboration.update_attributes(params[:collaboration])
        format.html { redirect_to(@collaboration, :notice => 'Collaboration was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @collaboration.errors, :status => :unprocessable_entity }
      end
    end
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
