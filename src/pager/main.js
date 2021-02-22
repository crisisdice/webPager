function Pager() {
	const self = this;
	
	//rw
	self.lines = null;
	self.pageCounter = null;
	self.pageIndex = 0;
	
	//ro
	self.breaks = null;
	self.breakEnd = 0;
	self.totalPages = 0;
	
	self.getBreaks = function(array) {
		var breaks = [];
		
		breaks.push(-1);
		
		for (i = 0; i < array.length; i++)
		{
			if(array[i].innerHTML == "&nbsp;")
				breaks.push(i);
		}
		
		return breaks;
	}

	self.hideRange = function (start, end) {
		for(i = start+1; i < end; i++)
		{
			self.lines[i].style.display = 'none';
		}
	}

	self.showRange = function (start, end) {
		for(i = start+1; i < end; i++)
		{
			self.lines[i].style.display = 'block';
		}
	}
	
	self.updatePageCounter = function () {
		var text = `${ self.pageIndex + 1 } of ${ self.totalPages }`;
		
		self.pageCounter.innerHTML = text;
	}

	self.back = function () {
		if(self.pageIndex === 0)
			return;

		var currentEnd = self.breaks[self.pageIndex + 1];
		var divider = self.breaks[self.pageIndex];
		var newStart = self.breaks[self.pageIndex - 1]
		
		self.hideRange(divider, currentEnd);
		self.showRange(newStart, divider);
		
		self.pageIndex -= 1;
		
		self.updatePageCounter();
	}

	self.forward = function () {
		if(self.pageIndex === self.breakEnd)
			return;
			
		var currentStart = self.breaks[self.pageIndex];
		var divider = self.breaks[self.pageIndex + 1];
		var newEnd = self.breaks[self.pageIndex + 2]

		self.hideRange(currentStart, divider);
		self.showRange(divider, newEnd);
		
		self.pageIndex += 1;
		
		self.updatePageCounter();
	}
	
	self.gohome = function() {
		self.goToPage(1);
	}

	self.goToPage = function(pageNumber) {
		self.hideRange(self.breaks[self.pageIndex], self.breaks[self.pageIndex + 1]);

		self.pageIndex = pageNumber - 1;

		self.showRange(self.breaks[self.pageIndex], self.breaks[self.pageIndex + 1]);

		self.updatePageCounter();
	}
	
	self.init = function () {
		//html elements
		var content = document.getElementById("content").childNodes;
		var pageCounter = document.getElementById("page-counter");

		self.lines = Array.from(content).filter(x => x.nodeName == "P");
		self.pageCounter = pageCounter;
		
		//properties
		self.breaks = self.getBreaks(self.lines);
		self.totalPages = self.breaks.length - 1;
		self.breakEnd = self.totalPages - 1;
		
		self.showRange(self.breaks[0], self.breaks[1]);
		self.updatePageCounter();
		console.log("initalized");
	}
};