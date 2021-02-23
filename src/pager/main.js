function HttpClient() {
	const self = this;
	self.makeRequest = function(method, url) {
		return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror = function () {
				reject({
					status: this.status,
					statusText: xhr.statusText
					});
				};
			xhr.send();
		});
	}
}

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
	
	self.init = async function (contentObject) {
		console.log("initalizing");

		//dom mapping
		var content = document.getElementById("content");
		var pageCounter = document.getElementById("page-counter");

		self.lines = content.childNodes;
		self.pageCounter = pageCounter;

		//document properties
		self.breaks = contentObject.breaks;
		self.totalPages = self.breaks.length - 1;
		self.breakEnd = self.totalPages - 1;

		//initial display logic
		content.innerHTML = contentObject.text;

		self.showRange(self.breaks[0], self.breaks[1]);
		self.updatePageCounter();

		console.log("initalized");
	}
};
