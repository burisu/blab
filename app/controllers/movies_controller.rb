class MoviesController < ApplicationController
  formize do |f|
    f.fields :title, :duration, :first_on, :awarded
    f.group :shown_if=>:awarded do |g|
      g.field :several_times_awarded
      g.field :awards_count, :shown_if=>:several_times_awarded
    end
  end

  def search
    if request.post?
      @movies = Movie.where("title LIKE ?", "%#{params[:search].to_s.gsub(/\W+/, '%')}%")
      count = @movies.count
      response.headers["X-Return-Code"] = (count.zero? ? "zero" : count == 1 ? "one" : "many")
      if count == 1
        render :text=>url_for(@movies[0]), :layout=>false
        return
      end
    end
  end


  # GET /movies
  # GET /movies.xml
  def index
    @movies = Movie.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @movies }
    end
  end

  # GET /movies/1
  # GET /movies/1.xml
  def show
    @movie = Movie.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @movie }
    end
  end

  # GET /movies/new
  # GET /movies/new.xml
  def new
    @movie = Movie.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @movie }
    end
  end

  # GET /movies/1/edit
  def edit
    @movie = Movie.find(params[:id])
  end

  # POST /movies
  # POST /movies.xml
  def create
    @movie = Movie.new(params[:movie])
    save_and_respond(@movie)
  end

  # PUT /movies/1
  # PUT /movies/1.xml
  def update
    @movie = Movie.find(params[:id])
    save_and_respond(@movie, :attributes=>params[:movie])
  end

  # DELETE /movies/1
  # DELETE /movies/1.xml
  def destroy
    @movie = Movie.find(params[:id])
    @movie.destroy

    respond_to do |format|
      format.html { redirect_to(movies_url) }
      format.xml  { head :ok }
    end
  end
end
