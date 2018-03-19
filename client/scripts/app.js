var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !this.get('like'));
    this.collection.sort();
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,
  isAscending: true,
  field: 'title',
  initialize: function() {

  },
  
  reverseSortBy: function(sortByFunction) {
    return function(a, b) {
      var l = sortByFunction(a);
      var r = sortByFunction(b);

      if (l === void 0) {
        return -1;
      }
      if (r === void 0) {
        return 1;
      }
      return l < r ? 1 : l > r ? -1 : 0;
    };
  },

  comparator: function(movie) {
    return movie.get('title'); 
  },

  sortByField: function(field) {
    if (this.field === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.isAscending = true;
      this.field = field;
    }

    if (this.isAscending) {
      this.comparator = function(movie) {
        return movie.get(this.field);
      };
      console.log(this.field);

      console.log('true', this.comparator);
      this.sort();
    } else {
      this.comparator = this.reverseSortBy(this.comparator);
      console.log('false', this.comparator);

      this.sort();
    }
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change:like', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
