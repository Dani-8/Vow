

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreatePost}
                currentUser={currentUser}
            />
        </div>
    );
};
